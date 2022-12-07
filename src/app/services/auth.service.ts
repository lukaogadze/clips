import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {UserModel} from "../models/user.model";
import {delay, map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _usersCollection: AngularFirestoreCollection<
        {
            name: string,
            email: string,
            age: number,
            phoneNumber: string
        }
    >;

    readonly isAuthenticated$: Observable<boolean>;
    readonly isAuthenticatedWithDelay$: Observable<boolean>;

    constructor(private readonly _angularFireAuth: AngularFireAuth,
                private readonly _angularFireStore: AngularFirestore) {
        this._usersCollection = this._angularFireStore.collection('users');

        this.isAuthenticated$ = this._angularFireAuth.user.pipe(map(x => !!x));
        this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    }

    async login(email: string, password: string) {
        await this._angularFireAuth.signInWithEmailAndPassword(email, password);
    }

    async logout() {
        await this._angularFireAuth.signOut();
    }

    isEmailTaken(email: string) {
        return this._angularFireAuth.fetchSignInMethodsForEmail(email);
    }

    async createUser(userDate: UserModel) {
        const userCredentials = await this._angularFireAuth.createUserWithEmailAndPassword(
            userDate.email, userDate.password
        );

        await this._usersCollection.doc(userCredentials.user?.uid).set({
            name: userDate.name,
            email: userDate.email,
            age: userDate.age,
            phoneNumber: userDate.phoneNumber
        });

        await userCredentials.user?.updateProfile(
            {displayName: userDate.name}
        );
    }
}
