import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeActivityReportComponent } from './activity-reports.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule if you're using ngModel
import { By } from '@angular/platform-browser'; // For querying elements in the template

describe('EmployeeActivityReportComponent', () => {
  let component: EmployeeActivityReportComponent;
  let fixture: ComponentFixture<EmployeeActivityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule, // Import FormsModule if you're using ngModel
      ],
      declarations: [ EmployeeActivityReportComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a calendar generated', () => {
    // Check that the calendar is created
    const calendarTable = fixture.debugElement.query(By.css('table.calendar'));
    expect(calendarTable).toBeTruthy();
  });

  it('should display the correct day when clicked', () => {
    // Example: Simulate a click on a calendar day
    const cell = fixture.debugElement.query(By.css('.calendar td'));
    cell.triggerEventHandler('click', { target: cell.nativeElement });
    fixture.detectChanges();

    // Assert that the correct date is selected
    expect(component.selectedDate).toBeTruthy();
  });

  it('should display hours worked for the selected date', () => {
    component.selectedDate = new Date(2024, 10, 5); // Example date: November 5, 2024
    component.loadHoursForDate(component.selectedDate);
    fixture.detectChanges();

    // Check if the activity data (e.g., total hours worked) is displayed
    const activityDetails = fixture.debugElement.query(By.css('.activity-details'));
    expect(activityDetails.nativeElement.textContent).toContain('Total Hours Worked');
  });
});
