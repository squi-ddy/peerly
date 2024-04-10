import secrets from "secrets.json"

const settings = {
    PORT: 3001,
    DOMAIN: "localhost",
    SESSION_SECRET: secrets.SESSION_SECRET,
    MEMCACHED_SECRET: secrets.MEMCACHED_SECRET,
    MEMCACHED_HOST: process.env.MEMCACHED_HOST || "memcached",
    DB_HOST: process.env.DB_HOST || "db",
}

export { settings }
