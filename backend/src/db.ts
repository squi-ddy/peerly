import mysql from "mysql2/promise"
import { settings } from "settings"

export const pool = mysql.createPool({
    host: settings.DB_HOST,
    user: "peerly",
    password: "peerly",
    database: "peerly",
    waitForConnections: true,
    connectionLimit: 4,
    typeCast: function (field, next) {
        if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
            var value = field.string();
            return (value === null) ? null : Number(value);
        }
        return next();
    }
})

export function convertBoolean(row: unknown, key: string) {
    if (typeof row !== "object" || !row) throw new Error("row is not an object")
    if (!row.hasOwnProperty(key)) throw new Error("key is not in row")
    const objRow = row as Record<string, unknown>
    if (typeof objRow[key] === "number") {
        if (objRow[key] === 0) {
            objRow[key] = false
        } else if (objRow[key] === 1) {
            objRow[key] = true
        }
    }
}

export async function getConnection() {
    return await pool.getConnection()
}
