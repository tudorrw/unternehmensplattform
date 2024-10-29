import { Component } from '@angular/core';
import {AuthenticationRequest} from "../../services/models/authentication-request";
import { Router } from '@angular/router';
import {AuthenticationControllerService} from "../../services/services/authentication-controller.service";
import {TokenService} from "../../services/token/token.service";
import { Message } from 'primeng/api';  // Import Message type

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {email: '', password_hash: ''};
  errorMsg: Message[] = [];  // Change to Message array

  constructor(
    private router: Router,
    private authService: AuthenticationControllerService,
    private tokenService: TokenService
  ) { }

  login() {
    console.log(this.authRequest.password_hash, this.authRequest.email);
    this.errorMsg = [];  // Clear previous error messages

    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (result) => {
        this.tokenService.token = result.token as string;
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.log(err.error);

        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors.map((msg: string) => ({severity: 'error', summary: 'Validation Error', detail: msg}));
        } else {
          this.errorMsg.push({severity: 'error', summary: err.error.businessErrorDescription, detail: err.error.errorMsg});
        }
      }
    });
  }
}
