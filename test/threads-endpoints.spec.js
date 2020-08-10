const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe(`Threads endpoints`, () => {
    let db;

    const testThreads = helpers.makeThreadsArray();
    const testCategories = helpers.makeCategoriesArray();
    const testUsers = helpers.makeUsersArray();
    const validUser = testUsers[0];

    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/threads`, () => {
        context('Given valid user', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                )
            })

            let expectedResult = [];

            testThreads.forEach(thread => {
                let cat = testCategories.find(category => category.id === thread.category);

                expectedResult.push({
                    ...thread,
                    category: cat.name,
                })
            })

            it('responds with 200 and corresponding threads', () => {
                return supertest(app)
                    .get('/api/threads')
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedResult);
            })
        })
    })

    describe(`GET /api/threads/:thread_id`, () => {
        context('Should return 200 and given thread', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                )
            })



            it.only('Responds with 200 and given thread item', () => {
                const threadId = 1;
                const expectedThread = testThreads[threadId - 1];

                return supertest(app)
                    .get(`/api/threads/${threadId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedThread);
            })
        })
    })

    describe(`GET /api/threads/category/:category_id`, () => {

    })

    describe(`GET /api/threads/user/:user_id`, () => {
        context('Given valid user', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                )
            })

            it('responds with 200 and corresponding threads', () => {
                const userId = 1;
                let tempThreads = testThreads.filter(thread => thread.user_id === userId)
                let expectedResult = [];

                tempThreads.forEach(thread => {
                    let cat = testCategories.find(category => category.id === thread.category);

                    expectedResult.push({
                        ...thread,
                        category: cat.name,
                    })
                })

                return supertest(app)
                    .get(`/api/threads/user/${userId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[userId - 1]))
                    .expect(200, expectedResult);
            })
        })
    })

    describe(`POST /api/threads`, () => {

    })

    describe(`DELETE /api/threads/:thread_id`, () => {

    })

    describe(`PATCH /api/threads/:thread_id`, () => {

    })
})