import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserDetailsDto } from '../../../services/models/user-details-dto';
import { UserCrudControllerService } from '../../../services/services/user-crud-controller.service';
import { VacationRequestDto } from '../../../services/models/vacation-request-dto';

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
  vacationRequest: VacationRequestDto = {
    description: '',
    startDate: '',
    endDate: '',
  };
  messages: any[] = [];
  dashboardMessages: any[] = []; // Messages displayed on the dashboard

  minDate: Date;
  maxDate: Date;
  invalidDates: Date[] = [];
  date5: Date[] = [];

  constructor(
    private userCrudControllerService: UserCrudControllerService,
    private messageService: MessageService
  ) {
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear(), 11, 31); // Dec 31st of the current year
    this.invalidDates = this.getWeekendsForThisYear();
  }

  ngOnInit(): void {
    this.fetchUserDetails();
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

  closeVacationDetailsDialog(): void {
    this.showVacationDetailsDialog = false;
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

  onSelect(event: any, calendar: any): void {
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
    };

    console.log('Vacation request submitted:', vacationRequest);
    this.requestVacationForm = false;
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
