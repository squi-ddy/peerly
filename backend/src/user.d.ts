declare namespace Express {
    type IUser = import("./types/user").IUserMinimal
    export interface User extends IUser {}
}
