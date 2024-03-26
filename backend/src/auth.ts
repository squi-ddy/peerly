import passport from "passport"
import { getConnection } from "db"
import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcryptjs"
import { isUser } from "checkers"
import { SerialisedUser } from "types/user"

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, callback) => {
            let res, _fields
            try {
                const conn = await getConnection()
                ;[res, _fields] = await conn.query(
                    "SELECT id, username, password FROM users WHERE username = ?",
                    [username],
                )
            } catch (error) {
                return callback(error)
            }

            if (!Array.isArray(res) || res.length === 0) {
                return callback(null, false, { message: "Invalid username" })
            }

            const user = res[0]

            if (!isUser(user)) {
                return callback(null, false, {
                    message: "Internal server error (user object incorrect)",
                })
            }

            if (!("password" in user) || typeof user.password !== "string") {
                return callback(null, false, {
                    message:
                        "Internal server error (password field non-existent)",
                })
            }

            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    return callback(error)
                }

                if (!result) {
                    return callback(null, false, {
                        message: "Invalid password",
                    })
                }

                delete user.password

                return callback(null, user)
            })
        },
    ),
)

passport.serializeUser<SerialisedUser>(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username })
    })
})

passport.deserializeUser(function (user: SerialisedUser, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})
