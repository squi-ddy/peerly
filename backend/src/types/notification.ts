import { tags } from "typia"
import { ISubject } from "./subject.js"
import { IStudentID, IUserMinimalInfo } from "./user.js"

export interface INotificationRecommendation {
    "interest-id": number & tags.Type<"uint32">
    "learner-sid": IStudentID
    subject: ISubject
    tutor: IUserMinimalInfo
}

export interface INotification {
    message: string
    "time-sent": string
    "notification-id": number & tags.Type<"uint32">
    tutor?: IUserMinimalInfo
    subjects?: ISubject[]
}

export interface INotificationDelete {
    "notification-id": number & tags.Type<"uint32">
}
