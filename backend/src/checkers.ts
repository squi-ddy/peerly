import { createIs, createValidate } from "typia"
import { IUserMinimal, IUserFull, IUserCreate, IUserPatch } from "types/user"
import { ISubject, ITutorSubject, ITutorSubjectCreate, ITutorSubjectGet } from "types/subject"
import {
    IEmptyTimeslot,
    IEmptyTimeslotCreate,
    IEmptyTimeslotGet,
} from "types/timeslot"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()
export const isSubjects = createIs<ISubject[]>()
export const isEmptyTimeslots = createIs<IEmptyTimeslot[]>()
export const isTutorSubjects = createIs<ITutorSubject[]>()

export const validateCreateUser = createValidate<IUserCreate>()
export const validatePatchUser = createValidate<IUserPatch>()
export const validateCreateTutorSubjects =
    createValidate<ITutorSubjectCreate[]>()
export const validateCreateEmptyTimeslots =
    createValidate<IEmptyTimeslotCreate[]>()
export const validateGetEmptyTimeslots = createValidate<IEmptyTimeslotGet>()
export const validateGetTutorSubjects = createValidate<ITutorSubjectGet>()
