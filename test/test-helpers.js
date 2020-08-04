const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeKnexInstance() {
    return knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
}

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            email: 'testuser1@test.com',
            password: 'password',
        },
        {
            id: 2,
            username: 'test-user-2',
            email: 'testuser2@test.com',
            password: 'password',
        },
    ]
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ userId: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function seedUsers() {
    // need to setup
}

function cleanTables() {
    // need to setup
}

module.exports = {
    makeKnexInstance,
    makeUsersArray,
    makeAuthHeader,
    cleanTables,
}