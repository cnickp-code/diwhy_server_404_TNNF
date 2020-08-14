const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')

describe(`Comments Endpoints`, () => {
    let db

    const testThreads = helpers.makeThreadsArray();
    const testInterests = helpers.makeInterestsArray()
    const testCategories = helpers.makeCategoriesArray()
    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testComments = helpers.makeCommentsArray()
    const testComment = testComments[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/comments`, () => {
        beforeEach('insert test threads', () => {
            return helpers.seedThreads(
                db,
                testThreads,
                testCategories,
                testUsers
            )
        })

        it('responds 201 with the inserted comment', () => {
            return supertest(app)
        })
    })

    describe.only(`GET /api/comments/:thread`, () => {
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
        
        beforeEach('insert threads', () => {
            helpers.seedThreadsCompact(
                db,
                testThreads
            )
        })

        beforeEach('insert comments', () => {
            helpers.seedComments(
                db,
                testComments
            )
        })
        it('responds 200 with the comments for that thread', () => {
            const threadsId = 1
            console.log(testComments)
            return supertest(app)
                .get(`/api/comments/thread/1`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, testComments)
        })
    })

    describe(`DELETE /api/comments/:id`, () => {
        beforeEach('insert test threads', () => {
            return helpers.seedThreads(
                db,
                testThreads,
                testCategories,
                testUsers
            )
        })
        beforeEach('insert comments', () => {
            helpers.seedComments(
                db,
                testComments
            )
        })
        it('responds 204 for deleted comment', () => {
            return supertest(app)
                .delete('/api/comments/1')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(204)
        })
    })

    describe(`PATCH /api/comments/:id`, () => {
        beforeEach('insert test threads', () => {
            return helpers.seedThreads(
                db,
                testThreads,
                testCategories,
                testUsers
            )
        })
        beforeEach('insert comments', () => {
            helpers.seedComments(
                db,
                testComments
            )
        })
        it('responds 202 with the updated comment', () => {
            const update = { content: 'update content' }
            const expectedUpdate = {
                id: 1,
                content: 'update content',
                date_created: testComment.date_created,
                user_id: 1,
                thread_id: 1
            }
            return supertest(app)
                .patch('/api/comments/1')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(expectedUpdate)
                .expect(expectedUpdate)
        })
    })
})