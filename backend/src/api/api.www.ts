import express from "express"
import acctRouter from "./accounts"
import subjectRouter from "./subjects"
import timeslotsRouter from "./timeslots"
import tutelageRouter from "./tutelages"
import notificationRouter from "./notifications"

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
