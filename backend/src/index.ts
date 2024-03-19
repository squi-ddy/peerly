import { settings } from "./settings"
import apiRouter from "./api/api.www"
import http from "http"
import express from "express"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import session from "express-session"
import ConnectMemcachedSession from "connect-memcached"
import passport from "passport"

const app = express()
const port = settings.PORT
const domain = settings.DOMAIN
const server = http.createServer(app)

const MemcachedStore = ConnectMemcachedSession(session)

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: "50mb" }))
app.use(session({
    secret: settings.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
        hosts: ['memcached:11211'],
        secret: settings.MEMCACHED_SECRET
    })
}))
app.use(passport.session())

app.use("/", apiRouter)

server.listen(port, (): void => {
    return console.log(`Express is listening at http://${domain}:${port}`)
})