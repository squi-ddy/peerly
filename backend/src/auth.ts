import passport from "passport"
import { convertBoolean, pool } from "db"
import { Strategy as LocalStrategy } from "passport-local"
import { verify } from "passwords"
import { isMinimalUser } from "checkers"
import { IUserMinimal } from "types/user"

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "studentId",
            passwordField: "password",
        },
        async (studentId, password, callback) => {
            let res, _fields
            try {
                [res, _fields] = await pool.execute(
                    "SELECT uuid, username, password, `is-tutor`, `is-learner`, `student-id` FROM student WHERE `student-id` = ?",
                    [studentId],
                )
            } catch (error) {
                return callback(error)
            }

            if (!Array.isArray(res) || res.length === 0) {
                return callback(null, false, { message: "Invalid student id" })
            }

            const row = res[0]

            convertBoolean(row, "is-learner")
            convertBoolean(row, "is-tutor")

            if (!isMinimalUser(row)) {
                return callback(null, false, {
                    message: "Internal server error (returned row incorrect)",
                })
            }

            const user: IUserMinimal = {
                uuid: row.uuid,
                username: row.username,
                "is-learner": row["is-learner"],
                "is-tutor": row["is-tutor"],
                "student-id": row["student-id"],
            }

            if (!("password" in row) || typeof row.password !== "string") {
                return callback(null, false, {
                    message:
                        "Internal server error (password field non-existent)",
                })
            }

            try {
                const result = await verify(password, row.password)

                if (!result) {
                    return callback(null, false, {
                        message: "Invalid password",
                    })
                }
            } catch (err) {
                return callback(err)
            }

            return callback(null, user)
        },
    ),
)

passport.serializeUser<IUserMinimal>(function (user, cb) {
    process.nextTick(function () {
        cb(null, {
            uuid: user.uuid,
            username: user.username,
            "is-learner": user["is-learner"],
            "is-tutor": user["is-tutor"],
            "student-id": user["student-id"],
        })
    })
})

passport.deserializeUser(function (user: IUserMinimal, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})
