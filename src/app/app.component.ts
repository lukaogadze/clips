import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    readonly isAuthenticatedWithDelay$: Observable<boolean>;
    constructor(private readonly _authService: AuthService) {
        this.isAuthenticatedWithDelay$ = this._authService.isAuthenticatedWithDelay$;
    }
}
