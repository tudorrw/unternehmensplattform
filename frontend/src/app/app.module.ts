import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HttpClient } from '@angular/common/http'
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { LoginComponent } from './pages/login/login.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpTokenInterceptor} from "./services/interceptor/http-token/http-token.interceptor";
import { SuperadminDashboardComponent } from './pages/dashboard/superadmin-dashboard/superadmin-dashboard.component';
import { EmployeeDashboardComponent } from './pages/dashboard/employee-dashboard/employee-dashboard.component';
import { AdministratorDashboardComponent } from './pages/dashboard/administrator-dashboard/administrator-dashboard.component';
import { EmployeeManagerComponent } from "./functionalities/employee-management/employee-manager/employee-manager.component";
import { EmployeeEditDialogComponent } from "./functionalities/employee-management/employee-edit-dialog/employee-edit-dialog.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatInput} from "@angular/material/input";
import {MatDialogContent} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import { AddCompanyComponent } from './functionalities/company-creation/add-company/add-company.component';
import { AddAdminComponent } from './functionalities/company-creation/add-admin/add-admin.component';
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SuperadminDashboardComponent,
    EmployeeDashboardComponent,
    AdministratorDashboardComponent,
    AddCompanyComponent,
    AddAdminComponent,
    EmployeeManagerComponent,
    EmployeeEditDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    MessagesModule,
    MessageModule,
    MatCheckbox,
    MatInput,
    MatDialogContent,
    MatButton,
    OverlayPanelModule,
    AvatarModule,
    DialogModule,
    TableModule
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
