import express from "express"
import acctRouter from "./accounts/accounts"

const apiRouter = express.Router()

apiRouter.use("/acct", acctRouter)

apiRouter.get("/", (req, res) => {
    res.send("Peerly API")
})

export default apiRouter
