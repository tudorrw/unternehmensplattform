import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { WorkingDaysControllerService } from '../../../services/services/working-days-controller.service';
import { WorkingDaysDto } from '../../../services/models/working-days-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

interface ExtendedEventProps {
    description?: string;
}

type CustomEventInput = EventInput & {
    extendedProps?: ExtendedEventProps;
};

@Component({
    selector: 'app-activity-reports-employee',
    templateUrl: './activity-reports-employee.component.html',
    styleUrls: ['./activity-reports-employee.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    providers: [MessageService, DatePipe], // Asigură-te că DatePipe este în providers
})
export class ActivityReportsEmployeeComponent implements OnInit {
    activityDialog: boolean = false;
    detailDialog: boolean = false;
    selectedEventId: number | undefined = undefined;
    selectedDate: Date | null = null;
    startDate: Date | null = null;
    endDate: Date | null = null;
    description: string = '';
    events: CustomEventInput[] = [];
    isEditMode: boolean = false;

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
        },
        selectable: true,
        dateClick: (info) => this.onDateClick(info),
        eventClick: (info) => this.onEventClick(info),
        events: this.events,
        validRange: {
            end: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA'),
        },
    };

    constructor(
        private workingDaysService: WorkingDaysControllerService,
        private datePipe: DatePipe,
        private messageService: MessageService // Injectează MessageService pentru Toast
    ) {}

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.workingDaysService.getAllActivityReports().subscribe({
            next: (data: WorkingDaysDto[]) => {
                this.events = data.map((report) => {
                    const startDate = report.startDate ? new Date(report.startDate) : undefined;
                    const endDate = report.endDate ? new Date(report.endDate) : undefined;
                    if (startDate) {
                        this.selectedDate = startDate;
                    }
                    return {
                        id: report.id?.toString(),
                        start: startDate,
                        end: endDate,
                        title: report.description || 'Activity',
                        backgroundColor: '#007bff',
                        extendedProps: {
                            description: report.description,
                        },
                    };
                });
                this.calendarOptions.events = this.events;
            },
            error: (error: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error loading events',
                    detail: error.error.message || 'An error occurred while loading events.',
                    life: 5000,
                });
            },
        });
    }

    submitActivity(form: NgForm): void {
        if (this.description && this.startDate && this.endDate && this.selectedDate) {
            const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';
            const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';
            const formattedSelectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';

            if (!formattedStartDate || !formattedEndDate || !formattedSelectedDate) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Dates',
                    detail: 'Please select valid start, end, and selected dates.',
                    life: 5000,
                });
                return;
            }

            const activity: WorkingDaysDto = {
                id: this.selectedEventId,
                description: this.description,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                date: formattedSelectedDate,
            };

            if (this.isEditMode && this.selectedEventId !== undefined) {
                this.isEditMode = false;
                this.workingDaysService.modifyWorkingDay({ body: activity }).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Activity Updated',
                            detail: 'Your activity has been successfully updated.',
                            life: 5000,
                        });
                        this.loadEvents();
                        this.activityDialog = false;
                        form.resetForm();
                    },
                    error: (error: HttpErrorResponse) => {
                        console.error('Error updating activity:', error);
                        if (error.status === 409) {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Conflict',
                                detail: error.error.businessErrorDescription,
                                life: 5000,
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.error,
                                life: 5000,
                            });
                        }
                    },
                });
            } else {
                this.workingDaysService.createWorkingDay({ body: activity }).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Activity Submitted',
                            detail: 'Your activity has been successfully submitted.',
                            life: 5000,
                        });
                        this.loadEvents();
                        this.activityDialog = false;
                        form.resetForm();
                    },
                    error: (error: HttpErrorResponse) => {
                        console.error('Error submitting activity:', error);
                        if (error.status === 409) {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Conflict',
                                detail: error.error.businessErrorDescription,
                                life: 5000,
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.error,
                                life: 5000,
                            });
                        }
                    },
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please complete all required fields!',
                life: 5000,
            });
        }
    }

    onDateClick(info: any): void {
        // Your implementation for the date click event
        this.selectedEventId = undefined;  // Reset selectedEventId
        this.selectedDate = new Date(info.dateStr);  // Set selectedDate to the clicked date
        this.startDate = new Date(info.dateStr);  // Set startDate
        this.endDate = null;  // Reset endDate
        this.description = '';  // Reset description
        this.activityDialog = true;  // Open activity dialog
        this.isEditMode = false;  // Set to false, as this is a new activity
    }

    onEventClick(info: any): void {
        // Your implementation for the event click event
        const event = this.events.find((e) => e.id === info.event.id);
        if (event && event.extendedProps) {
            this.selectedEventId = event.id ? parseInt(event.id as string, 10) : undefined;
            this.startDate = new Date(event.start as string);
            this.endDate = new Date(event.end as string);
            this.description = event.extendedProps.description || '';
            this.selectedDate = new Date(event.start?.toString() || '');
            this.detailDialog = true;  // Open event details dialog
            this.isEditMode = true;    // Set to true, as this is an existing activity
        }
    }

    deleteActivity(eventId: string) {
        const params = { requestId: parseInt(eventId, 10) };
        this.workingDaysService.deleteWorkingDay(params).subscribe({
            next: () => {
                this.loadEvents();
                this.detailDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Activity Deleted',
                    detail: 'The activity has been successfully deleted.',
                    life: 5000,
                });
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error deleting activity:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete the activity.',
                    life: 5000,
                });
            },
        });
    }

    openEditDialog() {
        this.activityDialog = true;
        this.isEditMode = true;
        this.detailDialog = false;
    }
}
