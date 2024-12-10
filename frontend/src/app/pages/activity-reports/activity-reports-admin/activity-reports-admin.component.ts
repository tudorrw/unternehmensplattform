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

  constructor() {}

  ngOnInit(): void {
  }


}
