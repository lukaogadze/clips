export class UserModel {
    constructor(readonly email: string,
                readonly password: string,
                readonly age: number,
                readonly name: string,
                readonly phoneNumber: string) {
    }
}
