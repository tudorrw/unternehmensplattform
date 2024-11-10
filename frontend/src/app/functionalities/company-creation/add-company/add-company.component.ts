import { Component, EventEmitter, Output } from '@angular/core';
import {CompanyControllerService} from "../../../services/services/company-controller.service";
import {CompanyDto} from "../../../services/models/company-dto";
import {CompanyWithAdminDto} from "../../../services/models/company-with-admin-dto";
import {RegistrationRequest} from "../../../services/models/registration-request";
import {Message} from "primeng/api";

@Component({
    selector: 'app-add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
    @Output() closeForm = new EventEmitter<void>();
    @Output() companyCreated = new EventEmitter<void>();

    company: CompanyDto = { name: '', address: '', telefonNumber: '' };
    selectedAdmin: RegistrationRequest | null = null;
    errorMsg: Message[] = [];  // Change to Message array
    //
    // admins = [
    //     { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', telefonNumber: '+1234567890' },
    //     { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', telefonNumber: '+0987654321' }
    // ];

    selectedAdminId: number | null = null;
    isAdminFormVisible = false;


    constructor(private companyService: CompanyControllerService) {}


    openAddAdminForm() {
        this.isAdminFormVisible = true;
    }

    onAdminSubmit(newAdmin: RegistrationRequest) {
        this.selectedAdmin = newAdmin; // Store the received admin data
        this.isAdminFormVisible = false;
    }

    onSubmit() {
        const companyWithAdmin: CompanyWithAdminDto = {
            adminRegistration: this.selectedAdmin ?? undefined, // Use `undefined` if `selectedAdmin` is `null`
            companyDTO: this.company
        };

        this.companyService.createCompany({ body: companyWithAdmin }).subscribe({
            next: () => this.companyCreated.emit(),
            error: (error) => console.error("Error creating company:", error),
        });
    }


    removeAdmin() {
        this.selectedAdmin = null;
        this.openAddAdminForm(); // Optionally reopen the admin form if you want to add a new admin right away
    }
    close() {
        this.closeForm.emit();
    }
}
