import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { EmployeeEditDialogComponent } from "../employee-edit-dialog/employee-edit-dialog.component";

@Component({
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeManagerComponent {
  employees = [
    { firstName: 'John', lastName: 'Doe', accountLocked: false, telefon: '123-456-7890' },
    { firstName: 'Jane', lastName: 'Smith', accountLocked: true, telefon: '234-567-8901' },
  ];
  displayedColumns: string[] = ['firstName', 'lastName', 'accountLocked', 'telefon'];
  showTable: boolean = false;

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  openDialog(employee?: any): void {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      data: employee ? { ...employee } : { firstName: '', lastName: '', accountLocked: false, telefon: '' },
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          // Update existing employee
          const index = this.employees.findIndex(emp => emp === employee);
          if (index !== -1) {
            this.employees[index] = result;
          }
        } else {
          // Add new employee
          this.employees.push(result);
        }
        this.cdr.markForCheck();
      }
    });
  }

  showAllEmployees(): void {
    this.showTable = true;
  }
}
