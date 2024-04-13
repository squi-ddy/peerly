import {
    isEmptyTimeslots,
    isFindTimeslotsResults,
    validateCreateEmptyTimeslots,
    validateFindTimeslots,
    validateGetEmptyTimeslots,
} from "checkers"
import { convertBoolean, convertTime, pool } from "db"
import { Router } from "express"
import { IFindTimeslotsResult, Time } from "types/timeslot"

const timeslotsRouter = Router()

timeslotsRouter.get("/", (_req, res) => {
    res.send("Timeslots API")
})

timeslotsRouter.get("/getEmpty", async (req, res) => {
    const data = req.query
    const validationStatus = validateGetEmptyTimeslots(data)
    if (!validationStatus.success) {
        res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors,
        })
        return
    }

    const tutorSid = validationStatus.data["tutor-sid"]
    const [rows, _fields] = await pool.execute(
        `
        SELECT \`timeslot-id\`, \`tutor-sid\`, \`day-of-week\`, \`start-time\`, \`end-time\`
        FROM emptyTimeslot
        WHERE \`tutor-sid\` = ?
    `,
        [tutorSid],
    )

    if (!Array.isArray(rows)) {
        res.status(500).send("Internal Server Error (timeslots not a list)")
        return
    }

    rows.forEach((ele) => {
        convertTime(ele, "start-time")
        convertTime(ele, "end-time")
    })

    if (!isEmptyTimeslots(rows)) {
        res.status(500).send("Internal Server Error (timeslots not timeslots?)")
        return
    }

    res.json(rows)
})

timeslotsRouter.post("/setEmpty", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user

        if (!user["is-tutor"]) {
            res.sendStatus(401)
            return
        }

        const data = req.body
        const validationStatus = validateCreateEmptyTimeslots(data)
        if (!validationStatus.success) {
            res.status(400).json({
                message: "Validation error",
                errors: validationStatus.errors,
            })
            return
        }

        const emptyTimeslots = validationStatus.data.map((ts) => ({
            ...ts,
            "start-time": Time.fromITime(ts["start-time"]),
            "end-time": Time.fromITime(ts["end-time"]),
        }))

        const conn = await pool.getConnection()
        await conn.beginTransaction()

        try {
            // delete extra
            let [rows, _fields] = await conn.query(
                `
                DELETE FROM emptyTimeslot WHERE \`tutor-sid\` = ? AND (\`day-of-week\`, \`start-time\`, \`end-time\`) NOT IN (?)
            `,
                [
                    user["student-id"],
                    emptyTimeslots.map((ts) => [
                        ts["day-of-week"],
                        ts["start-time"],
                        ts["end-time"],
                    ]),
                ],
            )

            if (Array.isArray(rows)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            // insert; on duplicate key do nothing since all 4 columns make up the unique constraint
            [rows, _fields] = await conn.query(
                `
                INSERT INTO emptyTimeslot(\`tutor-sid\`, \`day-of-week\`, \`start-time\`, \`end-time\`) VALUES (?)
                ON DUPLICATE KEY UPDATE \`tutor-sid\`=\`tutor-sid\`
            `,
                [
                    emptyTimeslots.map((ts) => [
                        user["student-id"],
                        ts["day-of-week"],
                        ts["start-time"].toString(),
                        ts["end-time"].toString(),
                    ]),
                ],
            )

            if (Array.isArray(rows)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            await conn.commit()
            res.sendStatus(200)
        } catch (err) {
            await conn.rollback()
            res.status(500).json({ message: "SQL Error", error: err })
        } finally {
            conn.release()
        }
    } else {
        res.sendStatus(401)
    }
})

// this should be a GET, but because of the lengthy data that needs to be sent, it is a POST
timeslotsRouter.post("/findTutors", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401)
        return
    }

    const user = req.user

    if (!user["is-learner"]) {
        res.sendStatus(401)
        return
    }

    const data = req.body
    const validationStatus = validateFindTimeslots(data)
    if (!validationStatus.success) {
        res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors,
        })
        return
    }

    const params = validationStatus.data
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // drop old temporary tables
        await conn.execute("DROP TEMPORARY TABLE IF EXISTS timeslotsIn")
        await conn.execute("DROP TEMPORARY TABLE IF EXISTS interestedSubjects")

        // create temporary tables
        await conn.execute(
            "CREATE TEMPORARY TABLE timeslotsIn LIKE timeslotsInTemplate",
        )
        await conn.execute(
            "CREATE TEMPORARY TABLE interestedSubjects LIKE interestedSubjectsTemplate",
        )

        // insert into temporary tables
        await conn.query(
            "INSERT INTO timeslotsIn(`day-of-week`, `start-time`, `end-time`) VALUES (?)",
            [
                params.timeslots.map((ts) => [
                    ts["day-of-week"],
                    Time.fromITime(ts["start-time"]),
                    Time.fromITime(ts["end-time"]),
                ]),
            ],
        )
        await conn.query(
            "INSERT INTO interestedSubjects(`subject-code`) VALUES (?)",
            [params.subjects.map((s) => [s["subject-code"]])],
        )

        // call stored procedure
        const [rows, _fields] = await conn.execute("CALL find_timeslots(?)", [
            user["student-id"],
        ])

        if (!Array.isArray(rows)) {
            await conn.rollback()
            return res
                .status(500)
                .json({ message: "Internal server error (check SQL)" })
        }

        const data = rows[0]

        if (!Array.isArray(data)) {
            await conn.rollback()
            return res
                .status(500)
                .json({ message: "Internal server error (output not a list)" })
        }

        (data as IFindTimeslotsResult[]).forEach((row) => {
            row.timeslots.forEach((ts) => {
                convertTime(ts, "start-time")
                convertTime(ts, "end-time")
                convertBoolean(ts, "has-pending")
            })
        })

        if (!isFindTimeslotsResults(data)) {
            await conn.rollback()
            return res.status(500).json({
                message: "Internal server error (output rows incorrect)",
            })
        }

        res.json(data)

        await conn.commit()
    } catch (err) {
        console.log(err)
        await conn.rollback()
        res.status(500).json({ message: "SQL Error", error: err })
    } finally {
        conn.release()
    }
})

export default timeslotsRouter
