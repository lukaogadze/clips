import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {AlertColor} from "../../shared/alert/alert.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    readonly loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    });
    showAlert: boolean;
    alertMessage: string;
    alertColor: AlertColor;
    inSubmission: boolean = false;

    constructor(private readonly _authService: AuthService) {
        this.showAlert = false;
        this.alertMessage = 'Please wait! We are logging you in.'
        this.alertColor = 'blue';
    }

    async login() {
        this.showAlert = true;
        this.alertMessage = 'Please wait! We are logging you in.'
        this.alertColor = 'blue';
        this.inSubmission = true;


        const {email, password} = this.loginForm.value;
        try {
            await this._authService.login(email as string, password as string);
        } catch (e) {
            this.alertMessage = 'An unexpected error occurred. Please try again later.';
            this.alertColor = 'red';
            this.inSubmission = false;

            console.log(e);
            return;
        }

        this.alertMessage = 'Success! You are now logged in.';
        this.alertColor = 'green';
    }
}
