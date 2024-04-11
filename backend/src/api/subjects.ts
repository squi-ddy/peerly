import { isSubjects, isTutorSubjects, validateCreateTutorSubjects, validateGetTutorSubjects } from "checkers"
import { pool } from "db"
import { Router } from "express"

const subjectRouter = Router()

subjectRouter.get("/", (_req, res) => {
    res.send("Subjects API")
})

subjectRouter.get("/all", async (_req, res) => {
    const [result, _fields] = await pool.execute(`
        SELECT \`subject-code\`, name FROM subject ORDER BY name
    `)

    if (!Array.isArray(result)) {
        res.status(500).send("Internal Server Error (subjects not a list)")
        return
    }

    if (!isSubjects(result)) {
        res.status(500).send("Internal Server Error (subjects not subjects?)")
        return
    }

    res.json(result)
})

subjectRouter.post("/submitTutor", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user

        if (!user["is-tutor"]) {
            res.sendStatus(401)
            return
        }

        const data = req.body
        const validationStatus = validateCreateTutorSubjects(data)
        if (!validationStatus.success) {
            res.status(400).json({
                message: "Validation error",
                errors: validationStatus.errors,
            })
            return
        }

        const subjects = validationStatus.data

        const conn = await pool.getConnection()
        await conn.beginTransaction()

        try {
            // delete extra
            let [result, _fields] = await conn.query(
                `
                DELETE FROM canTeach WHERE \`tutor-sid\` = ? AND \`subject-code\` NOT IN (?)
            `,
                [user["student-id"], subjects.map((s) => s["subject-code"])],
            )

            if (Array.isArray(result)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            [result, _fields] = await conn.query(
                `
                INSERT INTO canTeach(\`tutor-sid\`, \`subject-code\`, \`subject-gpa\`, year) VALUES ?
                ON DUPLICATE KEY UPDATE \`subject-gpa\` = VALUES(\`subject-gpa\`), year = VALUES(year)
            `,
                [
                    subjects.map((s) => [
                        user["student-id"],
                        s["subject-code"],
                        s["subject-gpa"],
                        s.year,
                    ]),
                ],
            )

            if (Array.isArray(result)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            await conn.commit()
            res.sendStatus(200)
        } catch (err) {
            res.status(500).json({ message: "SQL Error", error: err })
        } finally {
            conn.release()
        }
    } else {
        res.sendStatus(401)
    }
})

subjectRouter.get("/getTutor", async (req, res) => {
    const data = req.query
    const validationStatus = validateGetTutorSubjects(data)
    if (!validationStatus.success) {
        res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors,
        })
        return
    }

    const tutorSid = validationStatus.data["tutor-sid"]
    const [result, _fields] = await pool.execute(
        `
        SELECT ct.\`tutor-sid\`, ct.\`subject-code\`, ct.\`subject-gpa\`, ct.year, s.name
        FROM canTeach ct
        JOIN subject s ON ct.\`subject-code\` = s.\`subject-code\`
        WHERE \`tutor-sid\` = ?
    `,
        [tutorSid],
    )

    if (!Array.isArray(result)) {
        res.status(500).send("Internal Server Error (tutor subjects not a list)")
        return
    }

    if (!isTutorSubjects(result)) {
        res.status(500).send("Internal Server Error (tutor subjects not tutor subjects?)")
        return
    }

    res.json(result)
})

export default subjectRouter
