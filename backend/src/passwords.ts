import { scrypt, randomBytes } from "node:crypto"

export async function hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex")
    const buf = await new Promise<Buffer>((res, rej) =>
        scrypt(password, salt, 64, (err, buf) => (err ? rej(err) : res(buf))),
    )
    return `${buf.toString("hex")}.${salt}`
}

export async function verify(password: string, hash: string): Promise<boolean> {
    const [hashed, salt] = hash.split(".")
    const buf = await new Promise<Buffer>((res, rej) =>
        scrypt(password, salt, 64, (err, buf) => (err ? rej(err) : res(buf))),
    )
    return buf.toString("hex") === hashed
}
