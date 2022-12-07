import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
    videoOrder: string;
    constructor(private readonly _router: Router,
                private readonly _activatedRoute: ActivatedRoute) {
        this.videoOrder = '1';
    }

    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            this.videoOrder = params.sort === '2' ? params.sort : '1';
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
}
