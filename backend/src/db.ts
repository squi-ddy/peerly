import mysql from "mysql2/promise"

const connection = await mysql.createConnection({
    host: "peerly-db",
    user: "peerly",
    password: "peerly",
    database: "peerly",
})

export { connection }
