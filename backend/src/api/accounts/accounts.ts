import express from "express"
import passport from "passport"
import bcrypt from "bcryptjs"
import { getConnection } from "db"
import { isFullUser } from "checkers"

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
    if (
        !("username" in req.body) ||
        typeof req.body.username !== "string" ||
        !req.body.username.match(/^[a-zA-Z0-9_-]+$/)
    ) {
        return res.status(400).json({ message: "Invalid username" })
    }

    if (!("password" in req.body) || typeof req.body.password !== "string") {
        return res.status(400).json({ message: "Invalid password" })
    }

    if (
        !("year" in req.body) ||
        typeof req.body.year !== "number" ||
        req.body.year < 1 ||
        req.body.year > 6
    ) {
        return res.status(400).json({ message: "Invalid year" })
    }

    // check if user already exists
    const conn = await getConnection()
    await conn.beginTransaction()
    const [rows, _fields] = await conn.query(
        "SELECT * FROM users WHERE username = ?",
        [req.body.username],
    )

    if (Array.isArray(rows) && rows.length > 0) {
        await conn.rollback()
        return res.status(400).json({ message: "User already exists" })
    }

    let hashedPass
    try {
        hashedPass = await bcrypt.hash(req.body.password, 10)
    } catch (err) {
        await conn.rollback()
        return res.status(500).json(err)
    }

    const [result, _fields2] = await conn.query(
        "INSERT INTO users (username, password, year) VALUES (?, ?, ?)",
        [req.body.username, hashedPass, req.body.year],
    )
    await conn.commit()

    if (Array.isArray(result)) {
        return res
            .status(500)
            .json({ message: "Internal server error (check SQL)" })
    }
    if (result.affectedRows !== 1) {
        return res
            .status(500)
            .json({ message: "Internal server error (user not created)" })
    }
    const id = result.insertId

    const user: Express.User = {
        id,
        username: req.body.username,
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
        const conn = await getConnection()
        const [result, _fields] = await conn.query(
            "SELECT username, id, year FROM users WHERE id = ?",
            [req.user.id],
        )
        if (!Array.isArray(result) || result.length !== 1) {
            return res
                .status(500)
                .json({ message: "Internal server error (user not found)" })
        }
        if (!isFullUser(result[0])) {
            return res
                .status(500)
                .json({ message: "Internal server error (user object incorrect)" })
        }
        res.json(result[0])
    } else {
        res.sendStatus(401)
    }
})

acctRouter.get("/", (req, res) => {
    res.send("Login API")
})

export default acctRouter
