import { createIs, createValidate } from "typia"
import { IUserMinimal, IUserFull, IUserCreate, IUserPatch } from "types/user"
import { ISubject } from "types/subjects"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()
export const isSubject = createIs<ISubject>()

export const validateCreateUser = createValidate<IUserCreate>()
export const validatePatchUser = createValidate<IUserPatch>()
