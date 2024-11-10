// superadmin-dashboard.component.ts

import { Component } from '@angular/core';
import {CompanyControllerService} from "../../../services/services/company-controller.service";
import {CompanyDto} from "../../../services/models/company-dto";

@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.scss']
})
export class SuperadminDashboardComponent {
  userRole: string = 'Superadmin'; // Presupunem că rolul este Superadmin
  companies: CompanyDto[] = []; // Lista de companii, inițial goală
  showMessage: boolean = false; // Pentru mesajul "No companies found"
  isAddCompanyFormVisible: boolean = false;
  isCompanyCreated: boolean = false; // Variabilă care lipsea


  constructor(
    private companyService: CompanyControllerService,
  ) {
  }


  showAllCompanies() {
    this.companyService.getAllCompanies()
      .subscribe({
        next: (companies) => {
          this.companies = companies;
          this.showMessage = this.companies.length === 0;
        },
        error: (error) => {
          console.error("Error fetching companies:", error);
          this.showMessage = true; // Show message if error occurs
        }
      });
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
