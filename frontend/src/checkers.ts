import { createIs } from "typia"
import { IUserMinimal, IUserFull } from "@backend/types/user.js"
import {
    ILearnerSubject,
    ISubject,
    ITutorSubject,
} from "@backend/types/subject.js"
import {
    IEmptyTimeslot,
    IFindTimeslotsResult,
} from "@backend/types/timeslot.js"
import { IPendingTutelage } from "@backend/types/tutelage.js"
import { INotification } from "@backend/types/notification.js"

export const isMinimalUser = createIs<IUserMinimal>()
export const isFullUser = createIs<IUserFull>()
export const isSubjectArray = createIs<ISubject[]>()
export const isEmptyTimeslotArray = createIs<IEmptyTimeslot[]>()
export const isTutorSubjectArray = createIs<ITutorSubject[]>()
export const isLearnerSubjectArray = createIs<ILearnerSubject[]>()
export const isFindTimeslotsResultArray = createIs<IFindTimeslotsResult[]>()
export const isPendingTutelageArray = createIs<IPendingTutelage[]>()
export const isNotificationArray = createIs<INotification[]>()
