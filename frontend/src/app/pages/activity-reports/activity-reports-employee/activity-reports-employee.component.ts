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
    messages: any[] = [];
    selectedEventId: number | undefined = undefined;  // Modificat de la `null` la `undefined`
    selectedDate: Date | null = null;
    startDate: Date | null = null;
    endDate: Date | null = null;
    description: string = '';
    events: CustomEventInput[] = [];
    isEditMode: boolean = false;

    // Calculăm ziua curentă plus o zi pentru intervalul valid
    // Adaugă 1 zi la data curentă

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
            // Interval valid: de la o dată trecută până la ziua curentă + 1
            end: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA')  // Ziua curentă + 1
        },
    };

    constructor(
        private workingDaysService: WorkingDaysControllerService,
        private datePipe: DatePipe // Injectează DatePipe aici
    ) {}

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.workingDaysService.getAllActivityReports().subscribe((data: WorkingDaysDto[]) => {
            this.events = data.map((report) => {
                const startDate = report.startDate ? new Date(report.startDate) : undefined;
                const endDate = report.endDate ? new Date(report.endDate) : undefined;

                // Setează selectedDate pe baza startDate al fiecărui raport
                if (startDate) {
                    this.selectedDate = startDate;  // Setează selectedDate corespunzător
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
        });
    }

    onDateClick(info: any) {
        this.selectedEventId = undefined;  // Modificat de la `null` la `undefined`
        this.selectedDate = new Date(info.dateStr);
        this.startDate = new Date(info.dateStr);
        this.endDate = null;
        this.description = '';
        this.activityDialog = true;
        this.isEditMode = false;
    }

    onEventClick(info: any) {
        const event = this.events.find((e) => e.id === info.event.id);
        if (event && event.extendedProps) {
            this.selectedEventId = event.id ? parseInt(event.id as string, 10) : undefined;  // Asigură-te că `id` nu este `null`
            this.startDate = new Date(event.start as string);
            this.endDate = new Date(event.end as string);
            this.description = event.extendedProps.description || '';
            this.selectedDate = new Date(event.start?.toString() || '');
            this.detailDialog = true;  // Afișează detaliile evenimentului
            this.isEditMode = true;    // Permite editarea acestui eveniment
        }
    }

    submitActivity(form: NgForm): void {
        if (this.description && this.startDate && this.endDate && this.selectedDate) {
            const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';
            const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';
            const formattedSelectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';

            if (!formattedStartDate || !formattedEndDate || !formattedSelectedDate) {
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Invalid Dates',
                        detail: 'Please select valid start, end, and selected dates.',
                    },
                ];
                return;
            }

            const activity: WorkingDaysDto = {
                id: this.selectedEventId,  // Aici este important să trimiteți `id`, nu `requestId`
                description: this.description,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                date: formattedSelectedDate,
            };

            // Verifică dacă este în modul de editare și trimite cererea corespunzătoare
            if (this.isEditMode && this.selectedEventId !== undefined) {  // Verifică dacă `selectedEventId` nu este `undefined`
                this.isEditMode = false;
                // Trimite cererea de actualizare a activității
                this.workingDaysService.modifyWorkingDay({
                    body: activity, // Trimiterea obiectului cu câmpul `id`
                }).subscribe({
                    next: (response) => {
                        this.messages = [
                            {
                                severity: 'success',
                                summary: 'Activity Updated',
                                detail: 'Your activity has been successfully updated.',
                            },
                        ];
                        this.loadEvents(); // Reîncarcă evenimentele
                        this.activityDialog = false; // Închide dialogul
                        form.resetForm(); // Resetează formularul
                    },
                    error: (error: HttpErrorResponse) => {
                        console.error('Error submitting activity:', error);
                        if (error.status === 409) {
                            this.messages = [{ severity: 'error', summary: 'Conflict', detail: error.error.businessErrorDescription }];
                        } else {
                            this.messages = [{
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.error,
                            }];
                        }
                    },
                });
            } else {
                // Trimite cererea de creare a unei activități noi
                this.workingDaysService.createWorkingDay({
                    body: activity,
                }).subscribe({
                    next: (response) => {
                        this.messages = [
                            {
                                severity: 'success',
                                summary: 'Activity Submitted',
                                detail: 'Your activity has been successfully submitted.',
                            },
                        ];
                        this.loadEvents(); // Reîncarcă evenimentele
                        this.activityDialog = false; // Închide dialogul
                        form.resetForm(); // Resetează formularul
                    },
                    error: (error: HttpErrorResponse) => {
                        console.error('Error submitting activity:', error);
                        if (error.status === 409) {
                            this.messages = [{ severity: 'error', summary: 'Conflict', detail: error.error.businessErrorDescription }];
                        } else {
                            this.messages = [{
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.error,
                            }];
                        }
                    },
                });
            }
        } else {
            this.messages = [{
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please complete all required fields!',
            }];
        }
    }

    deleteActivity(eventId: string) {
        const params = { requestId: parseInt(eventId, 10) };
        this.workingDaysService.deleteWorkingDay(params).subscribe(() => {
            this.loadEvents();
        });
    }

    openEditDialog() {
        this.activityDialog = true;
        this.isEditMode = true;
        this.detailDialog = false;
    }
}
