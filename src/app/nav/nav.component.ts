import {Component} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    readonly isAuthenticated$: Observable<boolean>;
    constructor(private readonly _modalService: ModalService,
                private readonly _authService: AuthService) {

        this.isAuthenticated$ = this._authService.isAuthenticated$;
    }


    openAuthModal($event: MouseEvent) {
        $event.preventDefault();
        this._modalService.toggleModal('auth');
    }

    async logout($event: MouseEvent) {
        $event.preventDefault();

        await this._authService.logout();
    }
}
