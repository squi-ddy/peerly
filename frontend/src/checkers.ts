import { createIs } from "typia"
import { IUserMinimal, IUserFull } from "@backend/types/user"
import { ISubject, ITutorSubject } from "@backend/types/subject"
import { IEmptyTimeslot } from "@backend/types/timeslot"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()
export const isSubjectArray = createIs<ISubject[]>()
export const isEmptyTimeslotArray = createIs<IEmptyTimeslot[]>()
export const isTutorSubjectArray = createIs<ITutorSubject[]>()
