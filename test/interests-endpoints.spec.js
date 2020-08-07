const helpers = require('./test-helpers')
const app = require('../src/app')

describe.skip(`Interests endpoints`, () => {
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

    describe(`GET /api/interests`, () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(
                db, 
                testUsers
            )
        )

        beforeEach('insert categories', () => 
            helpers.seedCategories(
                db,
                testCategories
            )
        )

        beforeEach('insert interests', () => 
            helpers.seedUserInterests(
                db,
                testInterests
            )
        )

        
    })
})