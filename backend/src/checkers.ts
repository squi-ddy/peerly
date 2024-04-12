import { createIs, createValidate } from "typia"
import { IUserMinimal, IUserFull, IUserCreate, IUserPatch } from "types/user"
import {
    ILearnerSubject,
    ILearnerSubjectCreate,
    ILearnerSubjectGet,
    ISubject,
    ITutorSubject,
    ITutorSubjectCreate,
    ITutorSubjectGet,
} from "types/subject"
import {
    IEmptyTimeslot,
    IEmptyTimeslotCreate,
    IEmptyTimeslotGet,
    IFindTimeslots,
    IFindTimeslotsResult,
} from "types/timeslot"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()
export const isSubjects = createIs<ISubject[]>()
export const isEmptyTimeslots = createIs<IEmptyTimeslot[]>()
export const isTutorSubjects = createIs<ITutorSubject[]>()
export const isLearnerSubjects = createIs<ILearnerSubject[]>()
export const isFindTimeslotsResults = createIs<IFindTimeslotsResult[]>()

export const validateCreateUser = createValidate<IUserCreate>()
export const validatePatchUser = createValidate<IUserPatch>()
export const validateCreateTutorSubjects =
    createValidate<ITutorSubjectCreate[]>()
export const validateCreateLearnerSubjects =
    createValidate<ILearnerSubjectCreate[]>()
export const validateCreateEmptyTimeslots =
    createValidate<IEmptyTimeslotCreate[]>()
export const validateGetEmptyTimeslots = createValidate<IEmptyTimeslotGet>()
export const validateGetTutorSubjects = createValidate<ITutorSubjectGet>()
export const validateGetLearnerSubjects = createValidate<ILearnerSubjectGet>()
export const validateFindTimeslots = createValidate<IFindTimeslots>()
