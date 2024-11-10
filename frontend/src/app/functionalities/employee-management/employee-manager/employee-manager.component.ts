import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { EmployeeEditDialogComponent } from "../employee-edit-dialog/employee-edit-dialog.component";
import {UserDetailsDto} from "../../../services/models/user-details-dto";
import {UserCrudControllerService} from "../../../services/services/user-crud-controller.service";
import {RegistrationRequest} from "../../../services/models/registration-request";


@Component({
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeManagerComponent {
  employees: UserDetailsDto[] = []; // Array to store employees fetched from backend

  showTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private userCrudService: UserCrudControllerService // Inject the service
  ) {}

  openDialog(employee?: UserDetailsDto): void {
    const dialogData: {
      accountLocked?: boolean;
      firstName: string;
      lastName: string;
      role?: "Superadmin" | "Administrator" | "Employee";
      telefonNumber: string;
      id?: number;
      email: string
    } | { firstName: string; lastName: string; telefonNumber: string; email: string; passwordHash: string } = employee
        ? {
          ...employee,
          email: employee.email || '', // Ensure email is always a string
          firstName: employee.firstName || '', // Ensure firstName is always a string
          lastName: employee.lastName || '', // Ensure lastName is always a string
          telefonNumber: employee.telefonNumber || '', // Ensure telefonNumber is always a string
        }
        : {
          firstName: '',
          lastName: '',
          email: '',
          passwordHash: '', // Required for registration
          telefonNumber: ''
        }; // Registration data with default values

    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          // Update existing employee
          this.updateEmployee(result as UserDetailsDto);
        } else {
          // Register new employee
          this.registerEmployee(result as RegistrationRequest);
        }
      }
    });
  }

  updateEmployee(userDetails: UserDetailsDto): void {
    console.log(userDetails);
    this.userCrudService.modifyUser({ body: userDetails }).subscribe({
      next: () => this.showAllEmployees(),
      error: (error) => console.error("Failed to update employee:", error)
    });
    if (!userDetails.accountLocked) {
      console.log("daca i locked")
      this.userCrudService.activateUser({ userId: userDetails.id! }).subscribe({
        next: () => {
          userDetails.accountLocked = false;
          console.log("User activated successfully.");
        },
        error: (error) => console.error("Failed to activate user:", error)
      });
    } else {
      this.userCrudService.deactivateUser({ userId: userDetails.id! }).subscribe({
        next: () => {
          userDetails.accountLocked = true;
          console.log("User deactivated successfully.");
        },
        error: (error) => console.error("Failed to deactivate user:", error)
      });
    }
  }
  registerEmployee(employee: RegistrationRequest): void {
    this.userCrudService.register({ body: employee }).subscribe({
      next: () => this.showAllEmployees(),
      error: (error) => console.error("Failed to register employee:", error)
    });
  }

  showAllEmployees(): void {
    this.userCrudService.getAllEmployees().subscribe({
      next: (employees: UserDetailsDto[]) => {
        this.employees = employees;
        this.showTable = true;
      },
      error: (error) => {
        console.error('Failed to fetch employees:', error);
      }
    });
  }
}
