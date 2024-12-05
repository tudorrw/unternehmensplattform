import { Component, OnInit } from '@angular/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isToday } from 'date-fns';

@Component({
  selector: 'app-activity-reports',
  templateUrl: './activity-reports.component.html',
  styleUrls: ['./activity-reports.component.scss']
})

export class EmployeeActivityReportComponent implements OnInit {
  viewDate: Date = new Date(); // Current month and year being viewed
  selectedDate: Date | null = null; // The date selected by the user
  totalHoursWorked: number = -1; // Hours worked for the selected date
  calendar: { date: Date; isToday: boolean; isSelected: boolean }[][] = []; // Matrix representing the calendar days
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Weekday labels

  // Sample data: Replace with actual employee activity data
  activityData: { date: Date; hours: number }[] = [
    { date: new Date(2024, 10, 5), hours: 8 },  // November 5, 2024
    { date: new Date(2024, 10, 8), hours: 6 },  // November 8, 2024
    { date: new Date(2024, 10, 15), hours: 7 }, // November 15, 2024
  ];

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
        isSelected: false, // Initially, no day is selected
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
    this.loadHoursForDate(date);
    this.updateSelectedDay(date); // Update the selected day style
  }

  // Update selected day styling
  updateSelectedDay(date: Date): void {
    this.calendar.forEach(week => {
      week.forEach(cell => {
        cell.isSelected = isSameDay(cell.date, date);
      });
    });
  }

  // Check if the given date is today
  isToday(date: Date): boolean {
    return isToday(date);
  }

  // Check if the given date is the selected date
  isSelectedDate(date: Date): boolean {
    return this.selectedDate ? isSameDay(this.selectedDate, date) : false;
  }

  // Load hours worked for the selected date
  loadHoursForDate(date: Date): void {
    const activity = this.activityData.find((entry) => isSameDay(entry.date, date));
    if (activity) {
      this.totalHoursWorked = activity.hours;
    } else {
      this.totalHoursWorked = 0; // No hours worked on this day
    }
  }
}
