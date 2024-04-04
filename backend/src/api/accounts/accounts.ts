import express from "express"
import passport from "passport"
import { getConnection, pool } from "db"
import argon2 from "@node-rs/argon2"
import { isFullUser, isMinimalUser, validateCreateUser } from "checkers"

const acctRouter = express.Router()

acctRouter.post("/login", (req, res, next) => {
    passport.authenticate(
        "local",
        (
            err: unknown,
            user: false | Express.User,
            info: unknown | undefined,
            _status: number | undefined,
        ) => {
            if (err) {
                return res.status(500).json(err)
            }
            if (!user) {
                return res.status(401).json(info)
            }
            req.login(user, function (err) {
                if (err) {
                    return res.status(500).json(err)
                }
                res.json(user)
            })
        },
    )(req, res, next)
})

acctRouter.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json(err)
        }
        res.sendStatus(200)
    })
})

acctRouter.post("/signup", async (req, res) => {
    let createUser = req.body
    const validationStatus = validateCreateUser(createUser)

    if (!validationStatus.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors,
        })
    }

    createUser = validationStatus.data

    // check if user already exists
    const conn = await getConnection()
    await conn.beginTransaction()
    let [rows, _fields] = await conn.execute(
        "SELECT `student-id` FROM student WHERE `student-id` = ?",
        [createUser["student-id"]],
    )

    if (Array.isArray(rows) && rows.length > 0) {
        await conn.rollback()
        await conn.release()
        return res.status(400).json({ message: "User already exists" })
    }

    let hashedPass
    try {
        hashedPass = await argon2.hash(createUser.password)
    } catch (err) {
        await conn.rollback()
        await conn.release()
        return res.status(500).json(err)
    }

    [rows, _fields] = await conn.execute(
        `INSERT INTO student 
            (\`student-id\`, uuid, name, username, password, class, email, \`year-offset\`) 
            VALUES 
            (?, uuid(), ?, ?, ?, ?, compute_year_offset(year(now()), ?, ?))
        `,
        [
            createUser["student-id"],
            createUser.name,
            createUser.username,
            hashedPass,
            createUser.class,
            createUser.email,
            createUser["student-id"],
            createUser.year,
        ],
    )

    if (Array.isArray(rows)) {
        return res
            .status(500)
            .json({ message: "Internal server error (check SQL)" })
    }
    if (rows.affectedRows !== 1) {
        return res
            .status(500)
            .json({ message: "Internal server error (user not created)" })
    }

    [rows, _fields] = await conn.execute(
        "SELECT uuid, username FROM student WHERE `student-id` = ?",
        [createUser["student-id"]],
    )

    if (!Array.isArray(rows) || rows.length !== 1) {
        await conn.rollback()
        await conn.release()
        return res
            .status(500)
            .json({ message: "Internal server error (user not found)" })
    }

    const user = rows[0]

    if (!isMinimalUser(user)) {
        await conn.rollback()
        await conn.release()
        return res
            .status(500)
            .json({ message: "Internal server error (user object incorrect)" })
    }

    req.login(user, function (err) {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(user)
    })
})

acctRouter.get("/session", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user)
    } else {
        res.sendStatus(401)
    }
})

acctRouter.get("/me", async (req, res) => {
    if (req.isAuthenticated()) {
        const [result, _fields] = await pool.execute(
            `
            SELECT 
                \`student-id\`, name, class, year, email, \`is-learner\`, \`is-tutor\`, uuid, username
            FROM student 
            WHERE uuid = ?
            `,
            [req.user.uuid],
        )
        if (!Array.isArray(result) || result.length !== 1) {
            return res
                .status(500)
                .json({ message: "Internal server error (user not found)" })
        }
        const user = result[0]
        if (!isFullUser(user)) {
            return res.status(500).json({
                message: "Internal server error (user object incorrect)",
            })
        }
        res.json(user)
    } else {
        res.sendStatus(401)
    }
})

acctRouter.get("/edit", async (req, res) => {
    if (req.isAuthenticated()) {
        const [_result, _fields] = await pool.execute("UPDATE ")
    } else {
        res.sendStatus(401)
    }
})

acctRouter.get("/", (req, res) => {
    res.send("Login API")
})

export default acctRouter
