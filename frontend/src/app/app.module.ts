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
import { AddCompanyComponent } from './functionalities/company-creation/add-company/add-company.component';
import { AddAdminComponent } from './functionalities/company-creation/add-admin/add-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SuperadminDashboardComponent,
    EmployeeDashboardComponent,
    AdministratorDashboardComponent,
    AddCompanyComponent,
    AddAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    MessagesModule, MessageModule
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
