import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: "peerly-db",
    user: "peerly",
    password: "peerly",
    database: "peerly",
    waitForConnections: true,
    connectionLimit: 4
})

const getConnection = async () => {
    return await pool.getConnection()
}

export { getConnection, pool }
