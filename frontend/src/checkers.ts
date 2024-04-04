import typia from "typia"
import { IUserMinimal, IUserFull } from "@backend/types/user"

export const isMinimalUser = typia.createIs<IUserMinimal>()
export const isFullUser = typia.createIs<IUserFull>()
