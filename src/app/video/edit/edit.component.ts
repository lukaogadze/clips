import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {ClipModel} from "../../services/clip.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertColor} from "../../shared/alert/alert.component";
import {ClipService} from "../../services/clip.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
    modalId: string;
    @Input() clip: ClipModel | null;
    @Output() clipUpdated: EventEmitter<ClipModel | null>;

    editForm =  new FormGroup({
        title: new FormControl<string>('', {
            validators: [
                Validators.required,
                Validators.minLength(3)
            ],
            nonNullable: true
        }),
        clipId: new FormControl('', {
            nonNullable: true
        })
    });
    showAlert: boolean;
    alertColor: AlertColor;
    alertMessage: string;
    inSubmission: boolean;


    constructor(private readonly _modalService: ModalService,
                private readonly _clipService: ClipService) {
        this.modalId = 'editClip';
        this.clip = null;

        this.showAlert = false;
        this.inSubmission = false;
        this.alertColor = 'blue';
        this.alertMessage = 'Please wait! Updating clip.'

        this.clipUpdated = new EventEmitter<ClipModel | null>();
    }

    ngOnInit(): void {
        this._modalService.register(this.modalId);
    }

    ngOnDestroy(): void {
        this._modalService.unregister(this.modalId);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.clip) {
            return;
        }

        this.showAlert = false;
        this.inSubmission = false;

        this.editForm.controls.clipId.setValue(this.clip.docId as string);
        this.editForm.controls.title.setValue(this.clip.title);
    }

    async submit() {
        if (!this.clip) {
            return;
        }

        this.inSubmission = true;
        this.showAlert = true;
        this.alertColor = 'blue';
        this.alertMessage = 'Please wait! Updating clip.'

        try {
            await this._clipService.updateClip(this.editForm.value.clipId as string, this.editForm.value.title as string);
        } catch (e) {
            this.inSubmission = false;
            this.alertColor = 'red';
            this.alertMessage = 'Something went wrong. Try again later.'

            return;
        }

        this.inSubmission = false;
        this.alertColor = 'green';
        this.alertMessage = 'Success!';

        this.clip.title = this.editForm.value.title as string;
        this.clipUpdated.emit(this.clip);
    }
}
