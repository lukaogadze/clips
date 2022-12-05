import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    readonly registerForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
        password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]),
        confirmPassword: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)])
    });


    showAlert: boolean = false;
    alertColor: string = 'blue';
    alertMessage: string = 'Please wait! Your account is begin created.';

    constructor() {
    }

    register() {
        this.showAlert = true;
        this.alertMessage = 'Please wait! Your account is begin created.';
        this.alertColor = 'blue';
    }
}


