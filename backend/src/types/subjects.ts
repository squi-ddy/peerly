import { tags } from "typia"

export interface ISubject {
    "subject-code": string & tags.MinLength<2> & tags.MaxLength<2>
    name: string & tags.MaxLength<30>
}