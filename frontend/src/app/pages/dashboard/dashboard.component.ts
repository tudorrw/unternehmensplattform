import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../services/token/token.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private tokenService: TokenService

  ) {}

  ngOnInit(): void {
    console.log(this.tokenService.userRoles);
  }
}
