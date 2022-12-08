import firebase from "firebase/compat/app";

export class ClipModel {
    constructor(readonly uid: string,
                readonly displayName: string,
                public title: string,
                readonly fileName: string,
                readonly url: string,
                readonly timeStamp: firebase.firestore.FieldValue,
                readonly docId: string | null = null) {
    }
}
