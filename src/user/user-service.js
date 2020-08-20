const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserService = {
    hasUserWithUserName(db, user_name) {
        return db('users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    hasUserWithEmail(db, email) {
        return db('users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    validateEmail(email) {
        if (!REGEX_EMAIL.test(email)) {
            return 'Email must be valid'
        }
        return null
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain one upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    getUserInfo(knex, user_name) {
        return knex
            .from('users')
            .select('*')
            .where({ user_name })
            .first()
    },
    serializeUser(user) {
        return {
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            endorsements: user.endorsements,
            profile_pic: user.profile_pic
        }
    }
}

module.exports = UserService;