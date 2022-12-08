import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";

import {v4 as uuid} from 'uuid';
import {AlertColor} from "../../shared/alert/alert.component";
import {last, switchMap} from "rxjs";
import {AuthService} from "../../services/auth.service";
import firebase from "firebase/compat/app";
import {ClipService} from "../../services/clip.service";
import {ClipModel} from "../../services/clip.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
    isDragOver: boolean;
    nextStep: boolean;
    uploadForm = new FormGroup({
        title: new FormControl<string>('', {
            validators: [
                Validators.required,
                Validators.minLength(3)
            ],
            nonNullable: true
        })
    });
    showAlert: boolean;
    alertColor: AlertColor;
    alertMessage: string;
    inSubmission: boolean;
    uploadPercentage: number;
    showPercentage: boolean;

    private _file: File | null | undefined;
    private _user: firebase.User | null;
    private _fileUploadTask: AngularFireUploadTask | null;


    constructor(private readonly _angularFireStorage: AngularFireStorage,
                private readonly _authService: AuthService,
                private readonly _clipService: ClipService,
                private readonly _router: Router) {

        this.isDragOver = false;
        this._file = null;
        this.nextStep = false;
        this.showAlert = false;
        this.alertColor = 'blue';
        this.alertMessage = 'Please wait! Your clip is begin uploaded.'
        this.inSubmission = false;
        this.uploadPercentage = 0;
        this.showPercentage = false;
        this._user = null;
        this._fileUploadTask = null;

        this._authService.user$.subscribe(x => this._user = x);
    }

    ngOnDestroy(): void {
        this._fileUploadTask?.cancel();
    }

    storeFile($event: Event) {
        this.isDragOver = false;

        this._file = ($event as DragEvent).dataTransfer ?
            ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
            ($event.target as HTMLInputElement).files?.item(0);

        if (!this._file || this._file.type !== 'video/mp4') {
            return;
        }

        this.uploadForm.controls.title.setValue(
            this._file.name.replace(/\.[^/.]+$/, '')
        );

        this.nextStep = true;
    }

    uploadFile() {
        this.uploadForm.disable();
        this.showAlert = true;
        this.alertColor = "blue";
        this.alertMessage = 'Please wait! Your clip is begin uploaded.'
        this.inSubmission = true;
        this.showPercentage = true;

        const clipFileName = uuid();
        const clipPath = `clips/${clipFileName}.mp4`;

        this._fileUploadTask = this._angularFireStorage.upload(clipPath, this._file);
        const clipReference = this._angularFireStorage.ref(clipPath);

        this._fileUploadTask.percentageChanges().subscribe(x => this.uploadPercentage = x as number / 100);

        this._fileUploadTask.snapshotChanges().pipe(last(), switchMap(() => clipReference.getDownloadURL())).subscribe({
            next: async (url: string) => {
                const clip = new ClipModel(
                    this._user?.uid as string,
                    this._user?.displayName as string,
                    this.uploadForm.value.title as string,
                    `${clipFileName}.mp4`,
                    url,
                    firebase.firestore.FieldValue.serverTimestamp()
                );

                const clipDocumentReference = await this._clipService.createClip(clip)

                console.log(clip);

                this.alertColor = "green";
                this.alertMessage = 'Success! Your clip is now ready to share with the world.';
                this.showPercentage = false;

                setTimeout(() => {
                    this._router.navigate([
                        'clip', clipDocumentReference.id
                    ]);
                }, 1000);
            },
            error: (error) => {
                this.uploadForm.enable();
                this.alertColor = "red";
                this.alertMessage = "Upload failed! Please try again later.";
                this.inSubmission = true;
                this.showPercentage = false;
                console.log(error)
            }
        })
    }
}












































