import { Component, OnInit } from '@angular/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isToday } from 'date-fns';

@Component({
  selector: 'app-activity-reports-admin',
  templateUrl: './activity-reports-admin.component.html',
  styleUrls: ['./activity-reports-admin.component.scss']
})
export class ActivityReportsAdminComponent implements OnInit {
  viewDate: Date = new Date(); // Current month and year being viewed
  selectedDate: Date | null = null; // The date selected by the user
  activities: { description: string; hours: number }[] = []; // Activities for the selected day
  calendar: Date[][] = []; // Matrix representing the calendar days
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Weekday labels

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar(this.viewDate);
  }

  // Generate the calendar matrix for the given date
  generateCalendar(date: Date): void {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    const days: Date[] = [];

    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day);
    }

    // Split days into weeks
    this.calendar = [];
    while (days.length) {
      this.calendar.push(days.splice(0, 7));
    }
  }

  // Handle a day click event
  onDayClicked(date: Date): void {
    this.selectedDate = date;
    this.loadActivitiesForDate(date);
  }

  // Check if the given date is today
  isToday(date: Date): boolean {
    return isToday(date);
  }

  // Check if the given date is the selected date
  isSelectedDate(date: Date): boolean {
    return this.selectedDate ? isSameDay(this.selectedDate, date) : false;
  }

  // Load activities for the selected date
  loadActivitiesForDate(date: Date): void {
    // Example: Replace this with an actual API call
    if (isSameDay(date, new Date())) {
      this.activities = [
        { description: 'Meeting with team', hours: 2 },
        { description: 'Development task', hours: 4 }
      ];
    } else {
      this.activities = [];
    }
  }
}
