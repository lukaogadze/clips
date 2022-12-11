import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";

import {v4 as uuid} from 'uuid';
import {AlertColor} from "../../shared/alert/alert.component";
import {combineLatest, forkJoin, last, switchMap} from "rxjs";
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
    private _videoUploadTask: AngularFireUploadTask | null;
    private _screenshotUploadTask: AngularFireUploadTask | null;
    screenshots: string[];
    selectedScreenshot: string;


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
        this._videoUploadTask = null;
        this._screenshotUploadTask = null;
        this.screenshots = [];
        this.selectedScreenshot = '';

        this._authService.user$.subscribe(x => this._user = x);
    }

    ngOnDestroy(): void {
        this._videoUploadTask?.cancel();
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

        setTimeout(() => this.drawImages(this._file as any), 500);
    }

    private async blobFromURL(url: string) {
        const response = await fetch(url);
        return await response.blob();
    }

    async uploadFile() {
        this.uploadForm.disable();
        this.showAlert = true;
        this.alertColor = "blue";
        this.alertMessage = 'Please wait! Your clip is begin uploaded.'
        this.inSubmission = true;
        this.showPercentage = true;

        const clipFileName = uuid();
        const clipPath = `clips/${clipFileName}.mp4`;

        const screenshotBlob = await this.blobFromURL(this.selectedScreenshot);
        const screenshotPath = `screenshots/${clipFileName}.png`;

        this._videoUploadTask = this._angularFireStorage.upload(clipPath, this._file);
        const clipReference = this._angularFireStorage.ref(clipPath);

        this._screenshotUploadTask = this._angularFireStorage.upload(screenshotPath, screenshotBlob);
        const screenshotReference = this._angularFireStorage.ref(screenshotPath);

        combineLatest([this._videoUploadTask.percentageChanges(), this._screenshotUploadTask.percentageChanges()])
            .subscribe(values => {
                const [clipProgress, screenshotProgress] = values;
                if (!clipProgress || !screenshotProgress) {
                    return;
                }

                const total = clipProgress + screenshotProgress;

                this.uploadPercentage = total / 200;
            })

        forkJoin([this._videoUploadTask.snapshotChanges(), this._screenshotUploadTask.snapshotChanges()])
            .pipe(
                switchMap(
                    () => forkJoin([clipReference.getDownloadURL(), screenshotReference.getDownloadURL()])
                )
            ).subscribe({
            next: async (urls: string[]) => {
                const [clipUrl, screenshotUrl] = urls;

                const clip = new ClipModel(
                    this._user?.uid as string,
                    this._user?.displayName as string,
                    this.uploadForm.value.title as string,
                    `${clipFileName}.mp4`,
                    clipUrl,
                    screenshotUrl,
                    firebase.firestore.FieldValue.serverTimestamp(),
                    null,
                    `${clipFileName}.png`
                );

                const clipDocumentReference = await this._clipService.createClip(clip)

                this.alertColor = "green";
                this.alertMessage = 'Success! Your clip is now ready to share with the world.';
                this.showPercentage = false;

                setTimeout(() => {
                    this._router.navigate([
                        'clip', clipDocumentReference.id
                    ]);
                }, 500);
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

    private drawImages(file: File) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);

        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        let screenshotCount = 1;

        const listener = (e: Event) => {
            ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.screenshots.push(canvas.toDataURL('image/jpeg'));
            if (screenshotCount < 3) {
                screenshotCount++;
                video.currentTime = screenshotCount;
            } else {
                this.selectedScreenshot = this.screenshots[0];
                video.removeEventListener('timeupdate', listener, false);
            }
        };

        video.addEventListener('timeupdate', listener);
        video.currentTime = 1;
    }
}












































