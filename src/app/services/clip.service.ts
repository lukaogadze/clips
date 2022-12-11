import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot} from "@angular/fire/compat/firestore";
import {ClipModel} from "./clip.model";
import {AuthService} from "./auth.service";
import {BehaviorSubject, combineLatest, map, of, switchMap} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
    providedIn: 'root'
})
export class ClipService {
    private _clipsCollection: AngularFirestoreCollection<ClipModel>;

    constructor(private readonly _angularFireStore: AngularFirestore,
                private readonly _authService: AuthService,
                private readonly _angularFireStorage: AngularFireStorage) {

        this._clipsCollection = this._angularFireStore.collection('clips');
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
        return  this._clipsCollection.doc(id).update(
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
}
