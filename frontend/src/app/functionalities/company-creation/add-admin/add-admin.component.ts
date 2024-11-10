import { Component, EventEmitter, Output } from '@angular/core';
import {RegistrationRequest} from "../../../services/models/registration-request";
import {AuthenticationRequest} from "../../../services/models/authentication-request";
import {AuthenticationControllerService} from "../../../services/services/authentication-controller.service";

@Component({
    selector: 'app-add-admin',
    templateUrl: './add-admin.component.html',
    styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent {

  adminData: RegistrationRequest = { email: '', firstName: '', lastName: '', passwordHash: '' };


  @Output() adminSubmitted = new EventEmitter<RegistrationRequest>();
    @Output() closeForm = new EventEmitter<void>(); // Eveniment pentru închiderea formularului

    // Metoda care emite evenimentul adminSubmitted
    submitAdmin() {
        this.adminSubmitted.emit(this.adminData); // Emite datele adminului către componenta părinte
    }

    // Metoda pentru a închide formularul de admin
    closeFormHandler() {
        this.closeForm.emit(); // Emite evenimentul de închidere a formularului
    }
}
