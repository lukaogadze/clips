import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() modalId: string;
    constructor(private readonly _modalService: ModalService,
                private readonly _elementRef: ElementRef) {
        this.modalId = '';
    }

    isModalOpen() {
        return this._modalService.isModalOpen(this.modalId);
    }

    closeModal() {
        this._modalService.toggleModal(this.modalId);
    }

    ngOnInit(): void {
        document.body.appendChild(this._elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        document.body.removeChild(this._elementRef.nativeElement);
    }
}
