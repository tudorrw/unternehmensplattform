import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UserDetailsDto} from "../../../services/models/user-details-dto";
import {RegistrationRequest} from "../../../services/models/registration-request";
import {EmployeeData} from "../../../persistentModels/employee-data";

@Component({
  selector: 'app-employee-edit-dialog',
  templateUrl: './employee-edit-dialog.component.html',
  styleUrls: ['./employee-edit-dialog.component.scss']
})
export class EmployeeEditDialogComponent {
  isDialogOpen: boolean = true;
  isNewEmployee: boolean;


  constructor(
    public dialogRef: MatDialogRef<EmployeeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeData
  ) {
    this.isNewEmployee = !('id' in data); // If 'id' is missing, it's a new employee
  }

  onSave(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
