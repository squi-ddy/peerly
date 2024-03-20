declare namespace Express {
    type IUser = import("./types/user").IUser
    export interface User extends IUser {}
}
