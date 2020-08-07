const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')

describe.only(`Interests endpoints`, () => {
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

        it('should return user interests', () => {
            const testInterestsDetails = [
                {
                    id: 1,
                    user_id: 1,
                    category: 'Woodworking'
                },
                {
                    id: 2,
                    user_id: 1,
                    category: 'Needlecraft'
                },
                {
                    id: 3,
                    user_id: 1,
                    category: 'Metalworking'
                }
            ]
            return supertest(app)
                .get('/api/interests')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(testInterestsDetails)
        })
    })
})