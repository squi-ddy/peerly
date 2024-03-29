export interface IUser {
    id: number
    username: string
}

export type SerialisedUser = {
    id: number
    username: string
}

export interface IUserFull extends IUser {
    year: number
}
