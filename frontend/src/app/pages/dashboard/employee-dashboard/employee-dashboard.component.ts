import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserDetailsDto } from '../../../services/models/user-details-dto';
import { UserCrudControllerService } from '../../../services/services/user-crud-controller.service';
import { VacationRequestDto } from '../../../services/models/vacation-request-dto';
import { VacationReqControllerService } from '../../../services/services/vacation-req-controller.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  providers: [MessageService],
})
export class EmployeeDashboardComponent implements OnInit {
  userDetails: UserDetailsDto | null = null;
  vacationHistory: { year: number; daysUsed: number }[] = [];
  showVacationDetailsDialog = false;
  requestVacationForm = false;
  dialogWidth: string = '40rem';
  dialogHeight: string = '30rem';
  messages: any[] = [];
  dashboardMessages: any[] = [];
  availableAdministrators: { name: string; id: number }[] = [];
  selectedAdministratorId: number | null = null; // Administratorul selectat de utilizator

  minDate: Date;
  maxDate: Date;
  invalidDates: Date[] = [];
  date5: Date[] = [];

  constructor(
    private userCrudControllerService: UserCrudControllerService,
    private messageService: MessageService,
    private vacationReqControllerService: VacationReqControllerService
  ) {
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear(), 11, 31);
    this.invalidDates = this.getWeekendsForThisYear();
  }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.fetchAvailableAdministrator(); // Obține ID-ul administratorilor disponibili
  }

  fetchUserDetails(): void {
    this.userCrudControllerService.authenticatedUser().subscribe({
      next: (data: UserDetailsDto) => {
        this.userDetails = data;
        this.processVacationHistory();
      },
      error: (error) => {
        console.error('Failed to fetch user details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to fetch user details.',
          life: 3000,
        });
      },
    });
  }
  selectAdministrator(admin: { name: string; id: number }): void {
    this.selectedAdministratorId = admin.id;
  }


  fetchAvailableAdministrator(): void {
    this.vacationReqControllerService.getAvailableAdministrators().subscribe({
      next: (administrators) => {
        this.availableAdministrators = administrators
          .filter(admin => admin.id !== undefined) // Exclude administratorii fără ID
          .map(admin => ({
            name: `${admin.firstName} ${admin.lastName}`,
            id: admin.id as number // Păstrează doar id-ul administratorului
          }));
      },
      error: (error) => {
        console.error('Failed to fetch administrators:', error);
        this.availableAdministrators = [];
        this.selectedAdministratorId = null; // Administratorul nu este selectat
      },
    });
  }


  processVacationHistory(): void {
    if (this.userDetails && this.userDetails.previousYearVacationDays) {
      this.vacationHistory = [
        { year: new Date().getFullYear() - 1, daysUsed: this.userDetails.previousYearVacationDays },
      ];
    }
  }

  viewVacationDetails(): void {
    this.showVacationDetailsDialog = true;
  }

  requestVacation(): void {
    this.requestVacationForm = true;
    this.dialogWidth = '50rem';
    this.dialogHeight = '30rem';
    this.setVacationMessage();
  }

  setVacationMessage(): void {
    if (this.userDetails?.actualYearVacationDays !== undefined) {
      this.messages = [
        {
          severity: 'info',
          summary: 'Attention',
          detail: `You have ${this.userDetails.actualYearVacationDays} vacation days left this year.`,
        },
      ];
    } else {
      this.messages = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'No vacation days left or data unavailable.',
        },
      ];
    }
  }

  getWeekendsForThisYear(): Date[] {
    const weekends: Date[] = [];
    const year = new Date().getFullYear();
    let date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
      if (date.getDay() === 6 || date.getDay() === 0) {
        weekends.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    return weekends;
  }

  onSelect(event: any): void {
    if (!event || event.length === 0) {
      this.messages = [
        {
          severity: 'warn',
          summary: 'No dates selected',
          detail: 'Please select a vacation period before submitting.',
        },
      ];
    } else {
      this.messages = [];
    }
  }

  submitVacationRequest(): void {
    if (this.date5.length === 0) {
      this.messages = [
        {
          severity: 'warn',
          summary: 'No dates selected',
          detail: 'Please select a vacation period before submitting.',
        },
      ];
      return;
    }

    if (this.selectedAdministratorId === null) {
      this.messages = [
        {
          severity: 'warn',
          summary: 'No administrator selected',
          detail: 'Please select an administrator before submitting your request.',
        },
      ];
      return;
    }

    console.log('Selected Administrator ID:', this.selectedAdministratorId); // Verifică dacă ID-ul este corect

    const startDate = this.date5[0];
    const endDate = this.date5[1];
    const daysSelected = this.calculateDaysDifference(startDate, endDate);

    if (daysSelected > (this.userDetails?.actualYearVacationDays || 0)) {
      this.messages = [
        {
          severity: 'error',
          summary: 'Not enough vacation days',
          detail: `You have only ${this.userDetails?.actualYearVacationDays} vacation days left. Please select a shorter period.`,
        },
      ];
      return;
    }

    const vacationRequest: VacationRequestDto = {
      description: 'Requested vacation period',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      assignedAdministratorId: this.selectedAdministratorId, // Asigură-te că trimiti doar ID-ul
    };

    this.vacationReqControllerService.createVacationRequest({
      body: vacationRequest,
    }).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.messages = [
          {
            severity: 'success',
            summary: 'Vacation Request Submitted',
            detail: 'Your vacation request has been successfully submitted.',
          },
        ];
        this.dashboardMessages = [
          {
            severity: 'success',
            summary: 'Vacation Request Submitted',
            detail: 'Your vacation request has been successfully submitted.',
          },
        ];
        console.log('Vacation request submitted:', response);
      },
      error: (error) => {
        this.messages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error submitting your vacation request.',
          },
        ];
        console.error('Error submitting vacation request:', error);
      },
    });

    this.requestVacationForm = false; // Închide formularul
  }

  onDialogHide(): void {
    if (this.messages.length === 0) {
      this.dashboardMessages = [
        {
          severity: 'success',
          summary: 'Vacation Request Submitted',
          detail: 'Your vacation request has been successfully submitted.',
        },
      ];
    }
  }

  calculateDaysDifference(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }
}
