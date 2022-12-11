import {Pipe, PipeTransform} from '@angular/core';
import firebase from "firebase/compat/app";
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {
    constructor(private readonly _datePipe: DatePipe) {
    }

    transform(value: firebase.firestore.FieldValue | null | undefined) {
        if (!value) {
            return '';
        }

        const date = (value as firebase.firestore.Timestamp).toDate();

        return this._datePipe.transform(date, 'mediumDate');
    }

}
