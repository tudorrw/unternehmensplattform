import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
    @Output() closeForm = new EventEmitter<void>();
    @Output() companyCreated = new EventEmitter<void>();

    company = {
        name: '',
        address: '',
        telefonNumber: ''
    };

    admins = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', telefonNumber: '+1234567890' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', telefonNumber: '+0987654321' }
    ];

    selectedAdminId: number | null = null;
    isAdminFormVisible = false;

    openAddAdminForm() {
        this.isAdminFormVisible = true;
    }

    onAdminSubmit(newAdmin: any) {
        const id = this.admins.length + 1;
        this.admins.push({ id, ...newAdmin });
        this.isAdminFormVisible = false;
    }

    onSubmit() {
        console.log('Company data:', this.company);
        console.log('Selected Admin ID:', this.selectedAdminId);
        this.companyCreated.emit();
    }

    close() {
        this.closeForm.emit();
    }
}
