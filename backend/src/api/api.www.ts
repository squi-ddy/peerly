import express from "express"
import acctRouter from "./accounts.js"
import subjectRouter from "./subjects.js"
import timeslotsRouter from "./timeslots.js"
import tutelageRouter from "./tutelages.js"
import notificationRouter from "./notifications.js"

const apiRouter = express.Router()

apiRouter.use("/acct", acctRouter)
apiRouter.use("/subjects", subjectRouter)
apiRouter.use("/timeslots", timeslotsRouter)
apiRouter.use("/tutelages", tutelageRouter)
apiRouter.use("/notifications", notificationRouter)

apiRouter.get("/", (_req, res) => {
    res.send("Peerly API")
})

export default apiRouter
