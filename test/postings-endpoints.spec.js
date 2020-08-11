const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')

describe(`Comments Endpoints`, () => {
    let db

    const testInterests = helpers.makeInterestsArray()
    const testCategories = helpers.makeCategoriesArray()
    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))
})