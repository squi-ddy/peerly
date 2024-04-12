import { tags } from "typia"
import { IStudentID, IUserMinimal } from "./user"
import { ISubject, ISubjectCode } from "./subject"

export class Time {
    public readonly hour: number & tags.Minimum<0> & tags.ExclusiveMaximum<24>
    public readonly minute: number & tags.Minimum<0> & tags.ExclusiveMaximum<60>
    public readonly second: number & tags.Minimum<0> & tags.ExclusiveMaximum<60>

    constructor(hour: number, minute: number, second: number) {
        this.hour = hour
        this.minute = minute
        this.second = second
    }

    static fromHMSString(time: string) {
        const [hour, minute, second] = time.split(":").map(Number)
        return new Time(hour, minute, second ?? 0)
    }

    static fromHMString(time: string) {
        const [hour, minute] = time.split(":").map(Number)
        return new Time(hour, minute, 0)
    }

    static fromITime(time: ITime) {
        return new Time(time.hour, time.minute, time.second)
    }

    toString(): string {
        return `${this.hour}:${this.minute}:${this.second}`
    }
}

export interface ITime {
    hour: number & tags.Minimum<0> & tags.ExclusiveMaximum<24>
    minute: number & tags.Minimum<0> & tags.ExclusiveMaximum<60>
    second: number & tags.Minimum<0> & tags.ExclusiveMaximum<60>
}

export interface ITimeslot {
    "day-of-week": number & tags.Minimum<0> & tags.ExclusiveMaximum<5> // 0 -> Monday, 4 -> Friday
    "start-time": ITime
    "end-time": ITime
}

export interface IEmptyTimeslot extends ITimeslot {
    "timeslot-id": number & tags.Type<"uint32">
    "tutor-sid": IStudentID
}

export interface IEmptyTimeslotCreate
    extends Omit<IEmptyTimeslot, "timeslot-id" | "tutor-sid"> {}

export interface IEmptyTimeslotGet {
    "tutor-sid": IStudentID
}

export interface IFindTimeslots {
    subjects: ISubjectCode[]
    timeslots: ITimeslot[]
}

export interface IFindTimeslotsResult extends Pick<IUserMinimal, "username"> {
    "tutor-sid": IStudentID
    "can-teach-subjects": ISubject[]
    timeslots: ITimeslot[]
}
