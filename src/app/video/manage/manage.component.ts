import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ClipService} from "../../services/clip.service";
import {ClipModel} from "../../services/clip.model";
import {ModalService} from "../../services/modal.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
    videoOrder: string;
    clips: ClipModel[];
    activeClip: ClipModel | null;
    sort$: BehaviorSubject<string>;

    constructor(private readonly _router: Router,
                private readonly _activatedRoute: ActivatedRoute,
                private readonly _clipService: ClipService,
                private readonly _modalService: ModalService) {
        this.videoOrder = '1';
        this.clips = [];
        this.activeClip = null;

        this.sort$ = new BehaviorSubject<string>(this.videoOrder);
    }

    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            this.videoOrder = params.sort === '2' ? params.sort : '1';
            this.sort$.next(this.videoOrder);
        });


        this._clipService.getUserClips(this.sort$).subscribe(docs => {
            this.clips = [];

            docs.forEach(doc => {
                const clip: any = doc.data();
                this.clips.push({...clip, docId: doc.id});
            })
        });
    }

    sort($event: Event) {
        const {value} = $event.target as HTMLSelectElement;
        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {
                sort: value
            }
        });
    }

    openModal($event: MouseEvent, clip: ClipModel) {
        $event.preventDefault();
        this.activeClip = clip;

        this._modalService.toggleModal('editClip');
    }

    update($event: ClipModel | null) {
        const clipToUpdate = this.clips.find(x => x.docId === $event!.docId);
        clipToUpdate!.title = $event!.title;
    }

    async deleteClip($event: MouseEvent, clip: ClipModel) {
        $event.preventDefault();

        await this._clipService.deleteClip(clip);

        this.clips = this.clips.filter(x => x.docId !== clip.docId);
    }

    async copyToClipBoard($event: MouseEvent, docId: string | null) {
        $event.preventDefault();
        if (!docId) {
            return;
        }

        const url = `${location.origin}/clip/${docId}`;

        await navigator.clipboard.writeText(url);

        alert('Link Copied!');
    }
}
