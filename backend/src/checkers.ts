import { createIs, createValidate } from "typia"
import { IUserMinimal, IUserFull, ICreateUser } from "types/user"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()

export const validateCreateUser = createValidate<ICreateUser>()
