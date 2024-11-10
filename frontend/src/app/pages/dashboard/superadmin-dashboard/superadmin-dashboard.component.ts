// superadmin-dashboard.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.scss']
})
export class SuperadminDashboardComponent {
  userRole: string = 'Superadmin'; // Presupunem că rolul este Superadmin
  companies: any[] = []; // Lista de companii, inițial goală
  showMessage: boolean = false; // Pentru mesajul "No companies found"
  isAddCompanyFormVisible: boolean = false;
  isCompanyCreated: boolean = false; // Variabilă care lipsea


  constructor() {
    // Inițial, nu încărcăm companiile
  }

  showAllCompanies() {
    // Simulăm o încărcare a companiilor (de exemplu, dintr-un serviciu)
    // Pentru test, folosim date statice
    this.companies = [
      {
        name: 'Tech Solutions',
        address: '123 Main St, Tech City',
        phoneNumber: '(123) 456-7890',
        email: 'contact@techsolutions.com'
      },
      {
        name: 'Creative Minds',
        address: '456 Elm St, Innovation Town',
        phoneNumber: '(987) 654-3210',
        email: 'hello@creativeminds.com'
      },
      {
        name: 'Eco Goods',
        address: '789 Maple Ave, Green City',
        phoneNumber: '(555) 123-4567',
        email: 'info@ecogoods.com'
      }
    ];

    // Verificăm dacă lista de companii a fost încărcată
    if (this.companies.length > 0) {
      this.showMessage = false; // Ascundem mesajul "No companies found"
    } else {
      this.showMessage = true; // Afișăm mesajul dacă lista este goală
    }
  }

  openAddCompanyForm() {
    this.isAddCompanyFormVisible = true;
  }

  closeAddCompanyForm() {
    this.isAddCompanyFormVisible = false;
  }

  onCompanyCreated() {
    this.isCompanyCreated = true;
    this.isAddCompanyFormVisible = false;
    // Opțional: Reload companies după adăugare
    this.showAllCompanies();
  }
}
