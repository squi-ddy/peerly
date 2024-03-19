import secrets from 'secrets.json'

const settings = {
    PORT: 3001,
    DOMAIN: "localhost",
    SESSION_SECRET: secrets.SESSION_SECRET,
    MEMCACHED_SECRET: secrets.MEMCACHED_SECRET,
}

export { settings }