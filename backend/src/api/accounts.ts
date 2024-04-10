import { Router } from "express"
import passport from "passport"
import { convertBoolean, getConnection, pool } from "db"
import { hash } from "passwords"
import { isFullUser, isMinimalUser, validateCreateUser, validatePatchUser } from "checkers"

const acctRouter = Router()

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
    const userData = req.body
    const validationStatus = validateCreateUser(userData)

    if (!validationStatus.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors.map((e) => e.path),
        })
    }

    const createUser = validationStatus.data

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
        hashedPass = await hash(createUser.password)
    } catch (err) {
        await conn.rollback()
        await conn.release()
        return res.status(500).json(err)
    }

    [rows, _fields] = await conn.execute(
        `INSERT INTO student 
            (\`student-id\`, uuid, username, password, class, email, \`year-offset\`, \`is-learner\`, \`is-tutor\`) 
            VALUES 
            (?, uuid(), ?, ?, ?, ?, compute_year_offset(year(now()), ?, ?), ?, ?)
        `,
        [
            createUser["student-id"],
            createUser.username,
            hashedPass,
            createUser.class,
            createUser.email,
            createUser["student-id"],
            createUser.year,
            createUser["is-learner"],
            createUser["is-tutor"]
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

    await conn.commit()
    await conn.release()

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
                \`student-id\`, class, year, email, \`is-learner\`, \`is-tutor\`, uuid, username
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
        convertBoolean(user, "is-learner")
        convertBoolean(user, "is-tutor")
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

acctRouter.patch("/edit", async (req, res) => {
    if (req.isAuthenticated()) {
        const userData = req.body
        const validationStatus = validatePatchUser(userData)

        if (!validationStatus.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: validationStatus.errors.map((e) => e.path),
            })
        }

        const patchUser = validationStatus.data
        const hashedPass = patchUser.password ? await hash(patchUser.password) : undefined

        const [result, _fields] = await pool.execute(`
            UPDATE student 
            SET 
                username = IFNULL(?, username),
                class = IFNULL(?, class),
                year = IFNULL(?, year),
                email = IFNULL(?, email),
                \`is-learner\` = IFNULL(?, \`is-learner\`),
                \`is-tutor\` = IFNULL(?, \`is-tutor\`),
                password = IFNULL(?, password)
            WHERE uuid = ?`, [
                patchUser.username,
                patchUser.class,
                patchUser.year,
                patchUser.email,
                patchUser["is-learner"],
                patchUser["is-tutor"],
                hashedPass,
                req.user.uuid
            ])

        if (Array.isArray(result)) {
            return res
                .status(500)
                .json({ message: "Internal server error (check SQL)" })
        }

        if (result.affectedRows !== 1) {
            return res
                .status(500)
                .json({ message: "Internal server error (user not updated)" })
        }

        res.sendStatus(200)
    } else {
        res.sendStatus(401)
    }
})

acctRouter.get("/", (_req, res) => {
    res.send("Login API")
})

export default acctRouter
