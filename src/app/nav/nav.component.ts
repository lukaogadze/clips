import {Component} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {AuthService} from "../services/auth.service";
import {filter, map, Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    redirect: boolean;
    readonly isAuthenticated$: Observable<boolean>;
    constructor(private readonly _modalService: ModalService,
                private readonly _authService: AuthService,
                private readonly _router: Router,
                private readonly _activatedRoute: ActivatedRoute) {

        this.redirect = false;
        this.isAuthenticated$ = this._authService.isAuthenticated$;

        this._router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(() => this._activatedRoute.firstChild),
            switchMap(route => route?.data ?? of({}))
        ).subscribe(data => {
            this.redirect = data.authOnly ?? false;
        });
    }


    openAuthModal($event: MouseEvent) {
        $event.preventDefault();
        this._modalService.toggleModal('auth');
    }

    async logout($event: MouseEvent) {
        $event.preventDefault();

        await this._authService.logout();

        if (this.redirect) {
            await this._router.navigateByUrl('/');
        }
    }
}
