import { isNotifications, validateDeleteNotification } from "checkers"
import { pool } from "db"
import { Router } from "express"

const notificationRouter = Router()

notificationRouter.get("/", (_req, res) => {
    res.send("Notifications API")
})

notificationRouter.get("/all", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }
    const user = req.user

    // Fetch all notifications for the user
    try {
        const [rows, _fields] = await pool.execute(
            `
            SELECT 
                n.message, n.\`time-sent\`, n.\`notification-id\`,
                JSON_OBJECT(
                    'student-id', tut.\`student-id\`,
                    'username', tut.\`username\`
                ) tutor,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'subject-code', sub.\`subject-code\`, 
                        'name', sub.name
                    )
                ) subjects
            FROM notificationInterests ni
            JOIN interest i on ni.\`interest-id\` = i.\`interest-id\` and i.\`learner-sid\` = ?
            JOIN notification n on ni.\`notification-id\` = n.\`notification-id\`
            JOIN student tut on n.\`tutor-sid\` = tut.\`student-id\`
            JOIN subject sub on i.\`subject-code\` = sub.\`subject-code\`
            GROUP BY n.\`notification-id\`
        `,
            [user["student-id"]],
        )

        if (!Array.isArray(rows)) {
            res.status(500).send(
                "Internal Server Error (notifications not a list)",
            )
            return
        }

        if (!isNotifications(rows)) {
            res.status(500).send(
                "Internal Server Error (notifications not notifications?)",
            )
            return
        }

        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: "SQL Error", error: err })
    }
})

notificationRouter.delete("/delete", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }
    const user = req.user

    if (!user["is-learner"]) return res.sendStatus(401)
    const data = req.body
    const validationStatus = validateDeleteNotification(data)
    if (!validationStatus.success) {
        res.status(400).json({
            message: "Validation error",
            errors: validationStatus.errors,
        })
        return
    }

    const notificationId = validationStatus.data["notification-id"]

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        await conn.execute(
            `
            DELETE FROM notificationInterests
            WHERE \`notification-id\` = ? and \`interest-id\` IN (
                SELECT \`interest-id\` FROM interest WHERE \`learner-sid\` = ?
            )
        `,
            [notificationId, user["student-id"]],
        )

        // clean up dead notifications
        await conn.execute(
            `
            DELETE FROM notification
            WHERE \`notification-id\` = ? AND NOT EXISTS (
                SELECT 1 FROM notificationInterests WHERE \`notification-id\` = ?
            )
        `,
            [notificationId, notificationId],
        )

        await conn.commit()
        res.sendStatus(204)
    } catch (err) {
        await conn.rollback()
        res.status(500).json({ message: "SQL Error", error: err })
    } finally {
        conn.release()
    }
})

export default notificationRouter
