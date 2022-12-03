import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
    readonly modalId: string;
    constructor(private readonly _modalService: ModalService) {
        this.modalId = 'auth';
    }

    ngOnInit(): void {
        this._modalService.register(this.modalId);
    }

    ngOnDestroy(): void {
        this._modalService.unregister(this.modalId);
    }
}
