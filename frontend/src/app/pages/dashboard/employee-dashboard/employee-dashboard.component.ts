import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserDetailsDto } from '../../../services/models/user-details-dto';
import { UserCrudControllerService } from '../../../services/services/user-crud-controller.service';
import { VacationRequestDto } from '../../../services/models/vacation-request-dto';
import { VacationReqControllerService } from '../../../services/services/vacation-req-controller.service';
import { VacationRequest } from "../../../services/models/vacation-request";
import {map} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

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
    showVacationRequestsDialog = false;
    dialogWidth: string = '25rem';
    dialogHeight: string = '20rem';
    messages: any[] = [];  // Mesaje pentru formularul de cerere
    messages1: any[] = []; // Mesaje pentru tabelul de cereri
    availableAdministrators: UserDetailsDto[] = [];
    selectedAdministratorId: number | null = null;
    vacationRequests: VacationRequest[] = [];
    minDate: Date;
    maxDate: Date;
    invalidDates: Date[] = [];
    date5: Date[] = [];
    description: string = '';
    deleteFromBackend=true;
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
        this.fetchAvailableAdministrators();
        this.fetchVacationRequests();
    }


    //functii pt butonul de see more details
    viewVacationDetails(): void {
        this.showVacationDetailsDialog = true;
    }
    fetchUserDetails(): void {
        this.userCrudControllerService.authenticatedUser().subscribe({
            next: (data: UserDetailsDto) => {
                this.userDetails = data;
                this.processVacationHistory();
                this.setVacationMessage();
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



    //functii pt butonul de request vacation
    requestVacation(): void {
        this.requestVacationForm = true;
        this.dialogWidth = '25rem';
        this.dialogHeight = '20rem';
        this.setVacationMessage();
    }

    selectAdministrator(admin: { email: string; id: number }): void {
        this.selectedAdministratorId = admin.id;
    }

    fetchAvailableAdministrators(): void {
        this.vacationReqControllerService.getAvailableAdministrators().subscribe({
            next: (data: UserDetailsDto[]) => {
                this.availableAdministrators = data;
            },
            error: (error) => {
                console.error('Failed to fetch administrators:', error);
            }
        });
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
    calculateDaysDifference(startDate: any, endDate: any): number {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error('Invalid date format');
            return 0;
        }

        const timeDifference = end.getTime() - start.getTime();
        return timeDifference / (1000 * 3600 * 24);
    }
    submitVacationRequest(): void {
        // Verifică dacă nu s-au selectat date pentru vacanță
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

        // Verifică dacă nu s-a selectat un administrator
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

        // Verifică dacă angajatul nu mai are zile de vacanță
        if (this.userDetails?.actualYearVacationDays === 0) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'No vacation days available',
                    detail: 'You have no vacation days left for this year.',
                },
            ];
            return;
        }

        const startDate = this.date5[0];
        const endDate = this.date5[1];
        const daysSelected = this.calculateDaysDifference(startDate, endDate);

        // Verifică dacă zilele selectate sunt mai multe decât cele disponibile
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
            description: this.description,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            assignedAdministratorId: this.selectedAdministratorId,
        };

        // Trimite cererea de vacanță
        this.vacationReqControllerService.createVacationRequest({
            body: vacationRequest,
        }).subscribe({
            next: (response) => {
                // Verifică răspunsul pentru succes
                this.fetchVacationRequests();
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'Vacation Request Submitted',
                        detail: 'Your vacation request has been successfully submitted.',
                    },
                ];
                this.requestVacationForm = false;
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error submitting vacation request:', error);
                if (error.status === 409) {
                    const errorMessage = error.error?.message || 'The requested dates overlap with an existing vacation request';
                    this.messages = [{ severity: 'error', summary: 'Conflict', detail: errorMessage }];
                } else {
                    this.messages = [{ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again.' }];
                }
            },
        });
    }

//mesaje pentru dialogul de req vac
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

    //functii pt tabel
    setVacationTableMessage(): void {
        // Mesaj pentru zilele de vacanță rămase
        if (this.userDetails?.actualYearVacationDays !== undefined) {
            this.messages1 = [
                {
                    severity: 'info',
                    summary: 'Vacation Days Remaining',
                    detail: `You have ${this.userDetails.actualYearVacationDays} vacation days left this year.`,
                },
            ];
        }

        // Mesaj pentru cererile de vacanță
        if (this.vacationRequests.length === 0) {
            this.messages1.push({
                severity: 'info',
                summary: 'No vacation requests',
                detail: 'Currently, there are no vacation requests in the system.',
            });
        }
    }
    fetchVacationRequests(): void {
        this.vacationReqControllerService.getVacationRequestsByEmployee().subscribe({
            next: (data: any) => {
                this.vacationRequests = data as VacationRequest[];
                console.log('Fetched vacation requests:', this.vacationRequests);
                if (this.vacationRequests.length === 0) {
                    this.showVacationRequestsDialog = false;
                } else {
                    this.showVacationRequestsDialog = true;
                }
                this.setVacationTableMessage();
            },
            error: (error) => {
                console.error('Failed to fetch vacation requests:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to fetch vacation requests.',
                    life: 3000,
                });
            },
        });
    }


    //functiile de delete
    deleteVacationRequest(requestId: number): void {
        // Filtrează cererile pentru a elimina cererea cu ID-ul specificat
        this.vacationRequests = this.vacationRequests.filter(request => request.id !== requestId);

        // Notifică utilizatorul că cererea a fost eliminată doar din tabelul de front-end
        this.messages1 = [
            {
                severity: 'success',
                summary: 'Vacation Request Deleted',
                detail: `Vacation request with ID ${requestId} was removed from the table.`,
            },
        ];

        // Log pentru debugging
        console.log(`Vacation request with ID ${requestId} removed from front-end table.`);
        if (this.deleteFromBackend) {
            this.deleteVacationRequestFromBackend(requestId);
        }
    }
    private deleteVacationRequestFromBackend(requestId: number): void {
        this.vacationReqControllerService.deleteVacationRequest({ requestId }).subscribe({
            next: (response: string) => {
                console.log('Delete from backend response:', response);
                this.messages1.push({
                    severity: 'info',
                    summary: 'Backend Update',
                    detail: 'Vacation request successfully deleted from backend.',
                });
            },
            error: (error) => {
                console.error('Error deleting vacation request from backend:', error);
                this.messages1.push({
                    severity: 'error',
                    summary: 'Backend Error',
                    detail: 'Failed to delete vacation request from backend.',
                });
            },
        });
    }

}
