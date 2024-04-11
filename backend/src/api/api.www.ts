import express from "express"
import acctRouter from "./accounts"
import subjectRouter from "./subjects"
import timeslotsRouter from "./timeslots"

const apiRouter = express.Router()

apiRouter.use("/acct", acctRouter)
apiRouter.use("/subjects", subjectRouter)
apiRouter.use("/timeslots", timeslotsRouter)

apiRouter.get("/", (_req, res) => {
    res.send("Peerly API")
})

export default apiRouter
