import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

interface ExtendedEventProps {
  startDate?: Date;
  endDate?: Date;
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
})
export class ActivityReportsEmployeeComponent {
  activityDialog: boolean = false;
  detailDialog: boolean = false;
  selectedDate: Date | null = null;
  startDate: Date | undefined = undefined;
  endDate: Date | undefined = undefined;
  description: string = '';
  events: CustomEventInput[] = [];
  isEditMode: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    selectable: true,
    dateClick: (info) => this.onDateClick(info),
    eventClick: (info) => this.onEventClick(info),
    events: this.events,
  };

  onDateClick(info: any) {
    this.selectedDate = new Date(info.dateStr);
    this.startDate = undefined;
    this.endDate = undefined;
    this.description = '';
    this.activityDialog = true;
  }

  onEventClick(info: any) {
    const event = this.events.find(e => e.id === info.event.id);
    if (event && event.extendedProps) {
      this.selectedDate = new Date(event.start as string);
      this.startDate = event.extendedProps['startDate'] ?? undefined;
      this.endDate = event.extendedProps['endDate'] ?? undefined;
      this.description = event.extendedProps['description'] ?? '';
      this.detailDialog = true;
      this.isEditMode = true;
    }
  }

  openEditDialog() {
    this.startDate = this.startDate ?? undefined;
    this.endDate = this.endDate ?? undefined;
    this.description = this.description ?? '';
    this.activityDialog = true;
    this.detailDialog = false;
  }

  submitActivity(form: any) {
    if (form.valid) {
      let newEvent: CustomEventInput;

      if (this.isEditMode) {
        // Modifică evenimentul existent
        const updatedEvent = this.events.find(e => e.id === this.selectedDate?.toISOString());
        if (updatedEvent && updatedEvent.extendedProps) {
          // Actualizăm valorile
          updatedEvent.start = this.startDate?.toISOString();
          updatedEvent.end = this.endDate?.toISOString();
          updatedEvent.extendedProps['startDate'] = this.startDate;
          updatedEvent.extendedProps['endDate'] = this.endDate;
          updatedEvent.extendedProps['description'] = this.description;

          // Re-creăm lista de evenimente pentru a forța re-render-ul calendarului
          this.events = [...this.events];
        }
      } else {
        // Crează un nou eveniment
        newEvent = {
          id: `${this.selectedDate?.toISOString()}-${Math.random()}`,  // ID unic pentru eveniment
          start: this.startDate?.toISOString(),
          end: this.endDate?.toISOString(),
          title: 'Activity',
          backgroundColor: '#007bff',
          extendedProps: {
            startDate: this.startDate,
            endDate: this.endDate,
            description: this.description,
          },
        };

        // Adaugă evenimentul în lista de evenimente
        this.events = [...this.events, newEvent];
      }

      // Actualizează calendarul cu noua listă de evenimente
      this.calendarOptions.events = this.events;
      this.activityDialog = false;
      form.reset();
      this.isEditMode = false;
    }
  }


}
