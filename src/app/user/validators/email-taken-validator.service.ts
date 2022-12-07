import {AuthService} from "../../services/auth.service";
import {Injectable} from "@angular/core";
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";

@Injectable({providedIn: "root"})
export class EmailTakenValidator implements AsyncValidator {
    constructor(private readonly _authService: AuthService) {
    }

    validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
        return this._authService.isEmailTaken(control.value)
            .then(response => response.length ? {emailTaken: true} : null);
    }
}
