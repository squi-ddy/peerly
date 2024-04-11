import { tags } from "typia"

declare global {
    namespace Express {
        interface User extends IUserMinimal {}
    }
}

export type IStudentID = string &
    tags.MinLength<8> &
    tags.MaxLength<8> &
    tags.Pattern<"^h[0-9]{7}$">

export interface IUserMinimal {
    uuid: string & tags.Format<"uuid">
    "student-id": IStudentID
    username: string & tags.MaxLength<255> & tags.Pattern<"^[a-zA-Z0-9_]+$">
    "is-learner": boolean
    "is-tutor": boolean
}

export interface IUserFull extends IUserMinimal {
    class: number & tags.ExclusiveMaximum<100000> & tags.Minimum<0>
    year: number & tags.Type<"uint32">
    email: string & tags.MaxLength<255>
}

type ValidateClass = tags.TagBase<{
    kind: "class"
    target: "number"
    value: undefined
    validate: `(() => {
        const year = new Date().getFullYear() % 100
        return Math.round(($input - $input % 1000) / 1000) === year
    })()`
}>

// create user verification, we want to be more restrictive on 'year' and 'class'
// 'uuid' is generated by the server
export interface IUserCreate
    extends Omit<IUserFull, "year" | "class" | "uuid"> {
    password: string & tags.MaxLength<255> & tags.MinLength<8>
    year: number & tags.Minimum<1> & tags.Maximum<6>
    class: number & ValidateClass
}

// 'student-id' cannot be modified
// everything is optional too
export interface IUserPatch extends Partial<Omit<IUserCreate, "student-id">> {}
