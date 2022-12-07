import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    readonly registerForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        age: new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]),
        password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]),
        confirmPassword: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)])
    });

    showAlert: boolean = false;
    alertColor: string = 'blue';
    alertMessage: string = 'Please wait! Your account is begin created.';
    inSubmission = false;

    constructor(private readonly _authService: AuthService) {
    }

    async register() {
        this.showAlert = true;
        this.alertMessage = 'Please wait! Your account is begin created.';
        this.alertColor = 'blue';
        this.inSubmission = true;

        try {
            const userModel = new UserModel(
                this.registerForm.value.email as string,
                this.registerForm.value.password as string,
                this.registerForm.value.age as number,
                this.registerForm.value.name as string,
                this.registerForm.value.phoneNumber as string
            );
            await  this._authService.createUser(userModel);
        } catch (error) {
            console.log(error);

            this.alertMessage = 'An unexpected error occurred. Please try again later.';
            this.alertColor = 'red';
            this.inSubmission = false;
            return;
        }

        this.alertMessage = 'Success! Your account has been created.';
        this.alertColor = 'green';
    }
}


