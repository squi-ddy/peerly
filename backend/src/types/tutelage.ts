import { tags } from "typia"
import { IPendingTimeslot, IPendingTimeslotCreate } from "./timeslot"
import { IStudentID, IUserMinimalInfo } from "./user"

export interface IPendingTutelage {
    tutor: IUserMinimalInfo
    learner: IUserMinimalInfo
    "what-to-learn": string & tags.MaxLength<10000>
    "tutelage-id": number & tags.Type<"uint32">
    timeslots: IPendingTimeslot[]
}

export interface IPendingTutelageCreate
    extends Omit<
        IPendingTutelage,
        "learner" | "timeslots" | "tutor" | "tutelage-id"
    > {
    timeslots: IPendingTimeslotCreate[]
    "tutor-sid": IStudentID
}
