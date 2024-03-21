export interface IUser {
    id: number
    username: string
}

export interface IUserFull extends IUser {
    year: number
}
