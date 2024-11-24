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
  dialogHeight: string= '30rem'

  vacationRequest: VacationRequestDto = {
    description: '',
    startDate: '',
    endDate: '',
  };
  messages: any[] = [];

  // Date variables for calendar
  minDate: Date;
  maxDate: Date;
  invalidDates: Date[] = [];
  date5: Date[] = [];  // Variable to store the selected date range

  constructor(
    private userCrudControllerService: UserCrudControllerService,
    private messageService: MessageService
  ) {
    // Set minDate to current day and maxDate to last day of the year
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear(), 11, 31); // Dec 31st of the current year

    // Calculate invalid dates (weekends: Saturday and Sunday)
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
    this.dialogHeight= '30rem'

    this.setVacationMessage(); // Set the message when requesting vacation
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

  // Helper method to get weekends (Saturdays and Sundays)
  getWeekendsForThisYear(): Date[] {
    const weekends: Date[] = [];
    const year = new Date().getFullYear();
    let date = new Date(year, 0, 1); // Start from January 1st

    while (date.getFullYear() === year) {
      if (date.getDay() === 6 || date.getDay() === 0) {
        weekends.push(new Date(date));
      }
      date.setDate(date.getDate() + 1); // Increment day
    }

    return weekends;
  }

  // onSelect method for handling date selection in calendar
  onSelect(event: any, calendar: any): void {
    console.log('Selected Date Range:', event);

  }
}
