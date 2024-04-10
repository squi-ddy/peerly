import express from "express"
import acctRouter from "./accounts"
import subjectRouter from "./subjects"

const apiRouter = express.Router()

apiRouter.use("/acct", acctRouter)
apiRouter.use("/subjects", subjectRouter)

apiRouter.get("/", (_req, res) => {
    res.send("Peerly API")
})

export default apiRouter
