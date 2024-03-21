import typia from "typia"
import { IUser, IUserFull } from "./types/user"

export const isUser = typia.createIs<IUser>()
export const isFullUser = typia.createIs<IUserFull>()
