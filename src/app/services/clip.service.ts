import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot} from "@angular/fire/compat/firestore";
import {ClipModel} from "./clip.model";
import {AuthService} from "./auth.service";
import {BehaviorSubject, combineLatest, firstValueFrom, map, Observable, of, switchMap} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ClipService implements Resolve<ClipModel | null> {
    private readonly _clipsCollection: AngularFirestoreCollection<ClipModel>;
    private _pageClips: ClipModel[];
    private _pendingRequest: boolean;

    constructor(private readonly _angularFireStore: AngularFirestore,
                private readonly _authService: AuthService,
                private readonly _angularFireStorage: AngularFireStorage,
                private readonly _router: Router) {

        this._pageClips = [];
        this._clipsCollection = this._angularFireStore.collection('clips');
        this._pendingRequest = false;
    }

    getUserClips(sort$: BehaviorSubject<string>) {
        return combineLatest([this._authService.user$, sort$]).pipe(
            switchMap(values => {
                const [user, sort] = values;

                if (!user) {
                    return of();
                }

                const query = this._clipsCollection.ref.where(
                    'uid', '==', user.uid
                ).orderBy('timeStamp', sort === '1' ? 'desc' : 'asc');

                return query.get();
            }),
            map((snapshot: QuerySnapshot<ClipModel>) => snapshot.docs)
        );
    }

    createClip(clip: ClipModel): Promise<DocumentReference<ClipModel>> {
        return this._clipsCollection.add({...clip});
    }

    updateClip(id: string, title: string) {
        return this._clipsCollection.doc(id).update(
            {title: title}
        );
    }

    async deleteClip(clip: ClipModel) {
        const clipRef = this._angularFireStorage.ref(`clips/${clip.fileName}`);
        const screenshotRef = this._angularFireStorage.ref(`screenshots/${clip.screenshotFileName}`);
        await clipRef.delete();
        await screenshotRef.delete();
        await this._clipsCollection.doc(clip.docId as string).delete()
    }

    async getClips() {
        if (this._pendingRequest) {
            return;
        }

        this._pendingRequest = true;

        let query = this._clipsCollection.ref.orderBy('timeStamp', 'desc').limit(6);

        const {length} = this._pageClips;

        if (length) {
            const lastDocumentId = this._pageClips[length - 1].docId;
            const lastDocument = await firstValueFrom(this._clipsCollection.doc(lastDocumentId as string).get());

            query = query.startAfter(lastDocument);
        }

        const snapshot = await query.get();
        snapshot.forEach(doc => {
            this._pageClips.push({
                ...doc.data(),
                docId: doc.id
            })
        });

        this._pendingRequest = false;
    }

    getPageClips() {
        return [...this._pageClips];
    }

    clearPageClips() {
        this._pageClips = [];
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._clipsCollection.doc(route.params.id).get().pipe(
            map(x => {
                const data = x.data();

                if (!data) {
                    this._router.navigate(['/']);
                    return null;
                }

                return data;
            })
        );
    }
}
