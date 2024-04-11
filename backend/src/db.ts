import mysql from "mysql2/promise"
import { settings } from "settings"
import { ITime } from "types/timeslot"

export const pool = mysql.createPool({
    host: settings.DB_HOST,
    user: "peerly",
    password: "peerly",
    database: "peerly",
    waitForConnections: true,
    connectionLimit: 4,
    dateStrings: true,
    decimalNumbers: true,
})

export function convertBoolean(row: unknown, key: string) {
    if (typeof row !== "object" || !row) throw new Error("Row is not an object")
    if (!Object.prototype.hasOwnProperty.call(row, key))
        throw new Error("Key is not in row")
    const objRow = row as Record<string, unknown>
    if (typeof objRow[key] === "number") {
        if (objRow[key] === 0) {
            objRow[key] = false
        } else if (objRow[key] === 1) {
            objRow[key] = true
        }
    }
}

export function convertTime(row: unknown, key: string) {
    if (typeof row !== "object" || !row) throw new Error("Row is not an object")
    if (!Object.prototype.hasOwnProperty.call(row, key))
        throw new Error("Key is not in row")
    const objRow = row as Record<string, unknown>
    if (typeof objRow[key] === "string") {
        const parts = (objRow[key] as string).split(":")
        objRow[key] = {
            hour: parseInt(parts[0]),
            minute: parseInt(parts[1]),
            second: parseInt(parts[2]),
        } as ITime
    }
}

export async function getConnection() {
    return await pool.getConnection()
}
