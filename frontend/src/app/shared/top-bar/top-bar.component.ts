import {Component, Input, OnInit} from '@angular/core';
import {UserDetailsDto} from "../../services/models/user-details-dto";
import {UserCrudControllerService} from "../../services/services/user-crud-controller.service";
import {Router} from "@angular/router";
import {TokenService} from "../../services/token/token.service";
import {MenuItem} from "primeng/api";
import {UserRole} from "../../services/enums/UserRole";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit{
  userDetails: UserDetailsDto | null = null;
  tabMenuItems: MenuItem[] = [];
  activeTab: MenuItem | undefined = undefined;

  constructor(
    private userCrudControllerService: UserCrudControllerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userCrudControllerService.authenticatedUser().subscribe({
      next: (data: UserDetailsDto) => {
        this.userDetails = data;
        this.initializeMenuItems();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });

  }

  initializeMenuItems(): void {
    if (!this.userDetails) return;

    const role = this.userDetails.role;

    if (role === UserRole.Superadmin) {
      // No menu items for Superadmin
      this.tabMenuItems = [];
    } else if (role === UserRole.Administrator) {
      // Administrator gets all menu items
      this.tabMenuItems = [
        { label: 'Dashboard', icon: 'pi pi-home', command: () => this.router.navigate(['/dashboard']) },
        { label: 'Leave Requests', icon: 'pi pi-calendar', command: () => this.router.navigate(['/leave-requests']) },
        { label: 'Activity Reports', icon: 'pi pi-file', command: () => this.router.navigate(['/activity-reports']) },
      ];
    } else if (role === UserRole.Employee) {
      // Employee gets only Dashboard and Activity Reports
      this.tabMenuItems = [
        { label: 'Dashboard', icon: 'pi pi-home', command: () => this.router.navigate(['/dashboard']) },
        { label: 'Activity Reports', icon: 'pi pi-file', command: () => this.router.navigate(['/activity-reports']) },
      ];
    }

    // Set the default active tab if there are menu items
    this.activeTab = this.tabMenuItems.length > 0 ? this.tabMenuItems[0] : undefined;
  }
  onTabChange(selectedTab: MenuItem): void {
    this.activeTab = selectedTab;
  }

  goToProfile(): void {
    // this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
