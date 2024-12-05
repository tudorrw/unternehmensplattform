import { Component, OnInit } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
} from 'date-fns';

@Component({
  selector: 'app-activity-reports-admin',
  templateUrl: './activity-reports-admin.component.html',
  styleUrls: ['./activity-reports-admin.component.scss'],
})
export class ActivityReportsAdminComponent implements OnInit {
  viewDate: Date = new Date(); // Current month and year being viewed
  selectedDate: Date | null = null; // The date selected by the user
  activities: { description: string; hours: number }[] = []; // Activities for the selected day
  calendar: { date: Date; isToday: boolean; isSelected: boolean }[][] = []; // Calendar matrix
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Weekday labels

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar(this.viewDate);
  }

  // Generate the calendar matrix for the given date
  generateCalendar(date: Date): void {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    const days: { date: Date; isToday: boolean; isSelected: boolean }[] = [];

    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push({
        date: day,
        isToday: isToday(day),
        isSelected: this.selectedDate ? isSameDay(this.selectedDate, day) : false,
      });
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
    this.generateCalendar(this.viewDate); // Refresh calendar to update selection
    this.loadActivitiesForDate(date);
  }

  // Load activities for the selected date
  loadActivitiesForDate(date: Date): void {
    // Example: Replace this with an actual API call
    if (isSameDay(date, new Date())) {
      this.activities = [
        { description: 'Meeting with team', hours: 2 },
        { description: 'Development task', hours: 4 },
      ];
    } else {
      this.activities = [];
    }
  }
}
