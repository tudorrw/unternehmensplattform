import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../services/token/token.service";
import {UserCrudControllerService} from "../../services/services/user-crud-controller.service";
import {UserDetailsDto} from "../../services/models/user-details-dto";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userDetails: UserDetailsDto | null = null;

  constructor(private userCrudControllerService: UserCrudControllerService) {}

  ngOnInit(): void {
    this.userCrudControllerService.authenticatedUser().subscribe({
      next: (data: UserDetailsDto) => {
        this.userDetails = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }
}
