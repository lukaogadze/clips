import {Component} from '@angular/core';
import {ModalService} from "../services/modal.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    constructor(private readonly _modalService: ModalService) {
    }


    openAuthModal($event: MouseEvent) {
        $event.preventDefault();
        this._modalService.toggleModal('auth');
    }
}
