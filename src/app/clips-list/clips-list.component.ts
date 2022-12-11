import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClipService} from "../services/clip.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-clips-list',
    templateUrl: './clips-list.component.html',
    styleUrls: ['./clips-list.component.css'],
    providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
    @Input() scrollable: boolean;

    constructor(private readonly _clipService: ClipService) {
         this._clipService.getClips();
         this.scrollable = true;
    }

    ngOnInit(): void {
        if (this.scrollable) {
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    getPageClips() {
        return this._clipService.getPageClips();
    }

    handleScroll = () => {
        const {scrollTop, offsetHeight} = document.documentElement;
        const {innerHeight} = window;

        const bottomOfWindow = (Math.round(scrollTop) + innerHeight) === offsetHeight;

        if (bottomOfWindow) {
            this._clipService.getClips();
        }
    }

    ngOnDestroy(): void {
        if (this.scrollable) {
            window.removeEventListener('scroll', this.handleScroll);
        }

        this._clipService.clearPageClips();
    }
}
