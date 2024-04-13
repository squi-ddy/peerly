import { tags } from "typia"
import { IStudentID } from "./user"

export type ISubjectCode = string & tags.MinLength<2> & tags.MaxLength<2>
export interface ISubject {
    "subject-code": ISubjectCode
    name: string & tags.MaxLength<30>
}

export interface ISubjectOnlyCode extends Omit<ISubject, "name"> {}

export interface ITutorSubject extends ISubject {
    "subject-gpa": number & tags.Minimum<0> & tags.Maximum<5>
    year: number & tags.Minimum<1> & tags.Maximum<6>
    "tutor-sid": IStudentID
}

export interface ITutorSubjectCreate extends Omit<ITutorSubject, "name"> {}

export interface ITutorSubjectGet {
    "tutor-sid": IStudentID
}

export interface ILearnerSubject extends ISubject {
    "learner-sid": IStudentID
}

export interface ILearnerSubjectCreate extends Omit<ILearnerSubject, "name"> {}

export interface ILearnerSubjectGet {
    "learner-sid": IStudentID
}
