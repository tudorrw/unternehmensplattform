import {Component, OnInit, ViewChild} from '@angular/core';
import { MessageService} from "primeng/api";
import { UserDetailsDto } from "../../../services/models/user-details-dto";
import { UserCrudControllerService } from "../../../services/services/user-crud-controller.service";
import {Table} from "primeng/table";
import {RegistrationRequest} from "../../../services/models/registration-request";
import {DatePipe} from "@angular/common";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-administrator-dashboard',
  templateUrl: './administrator-dashboard.component.html',
  styleUrls: ['./administrator-dashboard.component.scss'],
  providers: [MessageService, DatePipe]
})
export class AdministratorDashboardComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm; // Access the form
  employees: UserDetailsDto[] = [];
  clonedEmployees: { [s: string]: UserDetailsDto } = {};
  searchValue: string | undefined;
  loading: boolean = true;
  showDialog: boolean = false;
  newEmployee: RegistrationRequest = {
    email: '',
    firstName: '',
    lastName: '',
    telefonNumber: '',
    passwordHash: '',
    signingDate: '',
  };


  constructor(
    private userCrudService: UserCrudControllerService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.showAllEmployees();

  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }


  showAllEmployees(): void {
    this.userCrudService.getAllEmployees().subscribe({
      next: (data: UserDetailsDto[]) => {
        this.employees = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch employees:', error);
        this.loading = false;
      }
    });
  }

  onRowEditInit(employee: UserDetailsDto) {
    this.clonedEmployees[employee.id!] = {...employee};
  }

  onRowEditSave(employee: UserDetailsDto) {
    if (!employee.firstName || !employee.lastName || !employee.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'First Name, Last Name, and Email cannot be empty.',
      });
      return; // Prevent saving
    }
    if (!this.validateEmail(employee.email) || !this.validatePhoneNumber(employee.telefonNumber)) {
      return; // Prevent saving if validation fails
    }
    this.updateEmployee(employee);

  }

  validateEmail(email: string): boolean {
    if(email == '') {
      return true;
    }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please enter a valid email address.'
        });
        return false;
      }
      return true;
  }

  validatePhoneNumber(phone: string | undefined): boolean {
    if(phone == '') {
      return true;
    }
    if (phone == undefined) {
      return false;
    }
    const phoneRegex = /^07[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Phone number must be in Romanian format (e.g., 0712312312).'
      });
      return false;
    }
    return true;
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) {
      return '';
    }
    return phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  }


  onRowEditCancel(employee: UserDetailsDto, index: number) {
    this.employees[index] = this.clonedEmployees[employee.id!];
    delete this.clonedEmployees[employee.id!];
  }

  updateEmployee(userDetails: UserDetailsDto): void {
    console.log("Updating employee:", userDetails);
    this.userCrudService.modifyUser({body: userDetails}).subscribe({
      next: () => {
        this.showAllEmployees();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee edited successfully',
          key: 'save-edit-employee',
          life: 2500
        });

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.businessErrorDescription,
          detail: 'Failed to update employee!',
          key: 'cancel-edit-employee',
          life: 2500
        });
        this.showAllEmployees();
      }
    });
  }

  addEmployee(form: NgForm): void {
    if (this.newEmployee.signingDate) {
      const formattedDate = this.datePipe.transform(this.newEmployee.signingDate, 'yyyy-MM-dd');
      this.newEmployee.signingDate = formattedDate ? formattedDate : undefined; // Ensure signingDate is either string or undefined
    }

    if (this.newEmployee.firstName && this.newEmployee.lastName && this.newEmployee.email) {
      this.userCrudService.register({body: this.newEmployee}).subscribe({
        next: () => {
          this.showAllEmployees();
          this.showDialog = false;
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Employee added successfully!', key: 'save-add-employee', life: 2500});
          form.resetForm();
        },
        error: (error) => {
          console.error('Failed to add employee:', error);
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.businessErrorDescription,  key: 'cancel-add-employee', life: 2500});
        }
      });
    } else {
      this.messageService.add({severity: 'error', summary: 'Validation Error', detail: 'Complete the required fields!', key: 'uncompleted-add-employee', life: 2500});
    }
  }

  onCancel(form: NgForm): void {
    this.showDialog = false;
    form.resetForm(); // Reset the form validation state
  }



}
