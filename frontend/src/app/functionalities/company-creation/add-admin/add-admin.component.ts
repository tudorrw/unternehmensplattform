import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-add-admin',
    templateUrl: './add-admin.component.html',
    styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent {
    adminData = { firstName: '', lastName: '', email: '' }; // Exemplu de date pentru admin

    @Output() adminSubmitted = new EventEmitter<any>(); // Eveniment pentru trimiterea datelor adminului
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
