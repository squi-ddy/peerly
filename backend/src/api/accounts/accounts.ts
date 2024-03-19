import express from "express"
import passport from "passport"
import bcrypt from "bcrypt"
import { connection as conn } from "db"

const acctRouter = express.Router()

acctRouter.post('/login', passport.authenticate('local'))

acctRouter.post('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return res.status(500).json(err) }
      res.sendStatus(200)
    });
  })

acctRouter.post('/signup', async (req, res) => {
  if (!('username' in req.body) || typeof req.body.username !== 'string' || !req.body.username.match(/^[a-zA-Z0-9_-]+$/)) {
    return res.status(400).json({ message: 'Invalid username' })
  }

  if (!('password' in req.body) || typeof req.body.password !== 'string') {
    return res.status(400).json({ message: 'Invalid password' })
  }

  if (!('year' in req.body) || typeof req.body.year !== 'number') {
    return res.status(400).json({ message: 'Invalid year' })
  }

  // check if user already exists
  let [rows, _] = await conn.query('SELECT * FROM users WHERE username = ?', [req.body.username])
  if (Array.isArray(rows) && rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' })
  }

  let hashedPass
  try {
    hashedPass = await bcrypt.hash(req.body.password, 10)
  } catch (err) {
    return res.status(500).json(err)
  }

  [rows, _] = await conn.query('INSERT INTO users (username, password, year) VALUES (?, ?, ?) RETURNING (username, id)', [req.body.username, hashedPass, req.body.year])
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(500).json({ message: 'Internal server error (user not created)' })
  }

  const user: any = rows[0]
  if (!(user satisfies Express.User)) {
    return res.status(500).json({ message: 'Internal server error (user object incorrect)' })
  }

  req.login(user, function(err) {
    if (err) { return res.status(500).json(err); }
    res.json(user)
  });
})

acctRouter.get("/", (req, res) => {
    res.send("Login API")
})

export default acctRouter