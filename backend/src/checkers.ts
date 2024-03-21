import { createIs } from "typia"
import { IUser, IUserFull } from "types/user"

export const isUser = createIs<IUser>()
export const isFullUser = createIs<IUserFull>()
