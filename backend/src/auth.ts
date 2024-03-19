import passport from 'passport';
import { connection as conn } from 'db';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, callback) => {
    let res, fields
    try {
        [res, fields] = await conn.query('SELECT * FROM users WHERE username = ?', [username])
    } catch (error) {
        return callback(error)
    }

    if (!Array.isArray(res) || res.length === 0) {
        return callback(null, false, { message: 'Invalid username or password' })
    }

    const user: any = res[0]

    if (!('password' in user) || typeof user.password !== 'string') {
        return callback(null, false, { message: 'Internal server error (password field non-existent)' })
    }

    if (!(user satisfies Express.User)) {
        return callback(null, false, { message: 'Internal server error (user object incorrect)' })
    }

    bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
            return callback(error)
        }

        if (!result) {
            return callback(null, false, { message: 'Invalid username or password' })
        }

        return callback(null, user)
    })
}));

type SerialisedUser = {
    id: number
    username: string
}

passport.serializeUser<SerialisedUser>(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user: SerialisedUser, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});