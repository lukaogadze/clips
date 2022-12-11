import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ClipModel} from "../services/clip.model";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-clip',
    templateUrl: './clip.component.html',
    styleUrls: ['./clip.component.css'],
    providers: [DatePipe]
})
export class ClipComponent implements OnInit {
    clip: ClipModel | null;
    private _videoElement: HTMLVideoElement | null;

    constructor(private readonly _activatedRoute: ActivatedRoute,
                private readonly _elementRef: ElementRef) {
        this.clip = null;
        this._videoElement = null;
    }

    ngOnInit(): void {
        this._videoElement = this._elementRef.nativeElement.querySelector('video');
        this._activatedRoute.data.subscribe(x => {
            this.clip = x.clip;
            this._videoElement?.load();
        });
    }

}
