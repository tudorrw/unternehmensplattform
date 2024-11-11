import { Component, OnInit } from '@angular/core';
import { UserCrudControllerService } from "../../services/services/user-crud-controller.service";
import { UserDetailsDto } from "../../services/models/user-details-dto";
import { Router } from '@angular/router';
import { TokenService } from "../../services/token/token.service";
import {UserRole} from "../../services/enums/UserRole";
import {UserWithCompanyDto} from "../../services/models/user-with-company-dto";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userDetails: UserWithCompanyDto | null = null;

  constructor(
    private userCrudControllerService: UserCrudControllerService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userCrudControllerService.authenticatedUser().subscribe({
      next: (data: UserWithCompanyDto) => {
        this.userDetails = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  goToProfile(): void {
    // this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  protected readonly UserRole = UserRole;
}
