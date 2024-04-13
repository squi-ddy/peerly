import {
    isEmptyTimeslots,
    isPendingTutelages,
    validateCreatePendingTutelage,
} from "checkers"
import { convertTime, pool } from "db"
import { Router } from "express"
import { IEmptyTimeslot, IPendingTimes, Time } from "types/timeslot"
import { IPendingTutelage } from "types/tutelage"

const tutelageRouter = Router()

tutelageRouter.get("/", (_req, res) => {
    res.send("Tutelage API")
})

tutelageRouter.post("/create", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user

        if (!user["is-learner"]) {
            res.sendStatus(401)
            return
        }

        const data = req.body
        const validationStatus = validateCreatePendingTutelage(data)
        if (!validationStatus.success) {
            res.status(400).json({
                message: "Validation error",
                errors: validationStatus.errors,
            })
            return
        }

        const validData = validationStatus.data

        const emptyTimeslots = validData.timeslots.map((ts) => ({
            ...ts,
            "start-time": Time.fromITime(ts["start-time"]),
            "end-time": Time.fromITime(ts["end-time"]),
            "tutor-sid": validData["tutor-sid"],
        }))

        const conn = await pool.getConnection()
        await conn.beginTransaction()

        try {
            // already exists?
            let [rows, _fields] = await conn.execute(
                `
                SELECT \`tutelage-id\` FROM pendingTutelage
                WHERE \`tutor-sid\` = ? AND \`learner-sid\` = ?
            `,
                [validData["tutor-sid"], user["student-id"]],
            )

            if (!Array.isArray(rows)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            if (rows.length > 0) {
                await conn.rollback()
                return res.status(400).json({
                    message: "You have already requested from this tutor!",
                })
            }

            // create pending tutelage
            [rows, _fields] = await conn.execute(
                `
                INSERT INTO pendingTutelage(\`tutor-sid\`, \`learner-sid\`, \`what-to-learn\`) VALUES (?, ?, ?)
            `,
                [
                    validData["tutor-sid"],
                    user["student-id"],
                    validData["what-to-learn"],
                ],
            )

            if (Array.isArray(rows)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            const tutelageId = rows.insertId

            // create timeslots
            // insert; on duplicate key do nothing since all 4 columns make up the unique constraint
            ;[rows, _fields] = await conn.query(
                `
                INSERT INTO emptyTimeslot(\`tutor-sid\`, \`day-of-week\`, \`start-time\`, \`end-time\`) VALUES ?
                ON DUPLICATE KEY UPDATE \`tutor-sid\`=\`tutor-sid\`
            `,
                [
                    emptyTimeslots.map((ts) => [
                        ts["tutor-sid"],
                        ts["day-of-week"],
                        ts["start-time"].toString(),
                        ts["end-time"].toString(),
                    ]),
                ],
            )

            // get the IDs of our inserted timeslots
            ;[rows, _fields] = await conn.query(
                `
                SELECT \`timeslot-id\`, \`tutor-sid\`, \`day-of-week\`, \`start-time\`, \`end-time\` FROM emptyTimeslot
                WHERE (\`tutor-sid\`, \`day-of-week\`, \`start-time\`, \`end-time\`) IN (?)
            `,
                [
                    emptyTimeslots.map((ts) => [
                        ts["tutor-sid"],
                        ts["day-of-week"],
                        ts["start-time"].toString(),
                        ts["end-time"].toString(),
                    ]),
                ],
            )

            if (!Array.isArray(rows)) {
                await conn.rollback()
                return res
                    .status(500)
                    .json({ message: "Internal server error (check SQL)" })
            }

            (rows as IEmptyTimeslot[]).forEach((row) => {
                convertTime(row, "start-time")
                convertTime(row, "end-time")
            })

            if (!isEmptyTimeslots(rows)) {
                await conn.rollback()
                return res.status(500).json({
                    message: "Internal server error (empty timeslots wrong)",
                })
            }

            const pendingTimes: IPendingTimes[] = []
            for (const row of rows) {
                const match = emptyTimeslots.filter((ts) => {
                    return (
                        ts["tutor-sid"] === row["tutor-sid"] &&
                        ts["day-of-week"] === row["day-of-week"] &&
                        Time.fromITime(ts["start-time"]).toString() ===
                            Time.fromITime(row["start-time"]).toString() &&
                        Time.fromITime(ts["end-time"]).toString() ===
                            Time.fromITime(row["end-time"]).toString()
                    )
                })
                if (!(match.length === 1)) {
                    await conn.rollback()
                    return res.status(500).json({
                        message: "No ID found",
                    })
                }
                const subject = match[0]["subject-code"]
                pendingTimes.push({
                    "tutelage-id": tutelageId,
                    "subject-code": subject,
                    "timeslot-id": row["timeslot-id"],
                })
            }

            // create pending times
            [rows, _fields] = await conn.query(
                `
                INSERT INTO pendingTimes(\`tutelage-id\`, \`subject-code\`, \`timeslot-id\`) VALUES ?
            `,
                [
                    pendingTimes.map((pt) => [
                        pt["tutelage-id"],
                        pt["subject-code"],
                        pt["timeslot-id"],
                    ]),
                ],
            )

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

tutelageRouter.get("/pending", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401)
        return
    }

    const user = req.user

    try {
        const [rows, _fields] = await pool.execute(
            `
                SELECT pt.\`what-to-learn\`,
                pt.\`tutelage-id\`,
                (
                    SELECT JSON_OBJECT(
                        'student-id', s.\`student-id\`,
                        'username', s.\`username\`
                    )
                    FROM student s
                    WHERE s.\`student-id\` = pt.\`tutor-sid\`
                ) tutor,
                (
                    SELECT JSON_OBJECT(
                        'student-id', s.\`student-id\`,
                        'username', s.\`username\`
                    )
                    FROM student s
                    WHERE s.\`student-id\` = pt.\`learner-sid\`
                ) learner,
                (
                    SELECT JSON_ARRAYAGG(tmp.vals)
                    FROM (
                        SELECT JSON_OBJECT(
                            'day-of-week', et.\`day-of-week\`,
                            'start-time', et.\`start-time\`,
                            'end-time', et.\`end-time\`,
                            'timeslot-id', et.\`timeslot-id\`,
                            'tutor-sid', et.\`tutor-sid\`,
                            'subject', JSON_OBJECT(
                                'subject-code', s.\`subject-code\`,
                                'name', s.\`name\`
                            )
                        ) vals
                        FROM pendingTimes pti 
                        JOIN emptyTimeslot et ON pti.\`timeslot-id\` = et.\`timeslot-id\`
                        JOIN subject s ON pti.\`subject-code\` = s.\`subject-code\`
                        WHERE pti.\`tutelage-id\` = pt.\`tutelage-id\`
                    ) tmp
                ) timeslots
                FROM pendingTutelage pt
                WHERE pt.\`learner-sid\` = ? OR pt.\`tutor-sid\` = ?
            `,
            [user["student-id"], user["student-id"]],
        )

        if (!Array.isArray(rows)) {
            return res
                .status(500)
                .json({ message: "Internal server error (check SQL)" })
        }

        (rows as IPendingTutelage[]).forEach((row) => {
            row.timeslots.forEach((ts) => {
                convertTime(ts, "start-time")
                convertTime(ts, "end-time")
            })
        })

        if (!isPendingTutelages(rows)) {
            return res.status(500).json({
                message: "Internal server error (pending tutelages wrong)",
            })
        }

        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: "SQL Error", error: err })
    }
})

export default tutelageRouter
