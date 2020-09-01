const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');
const postingsRouter = require('../src/postings/postings-router');

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
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());
    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/threads`, () => {
        context('Given valid user', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });
            let expectedThreads = testThreads.map(thread => {
                let user = testUsers.find(user => user.id === thread.user_id);
                let newObj = {
                    ...thread,
                    user_name: user.user_name
                };
                return newObj;
            });

            it('responds with 200 and corresponding threads', () => {
                return supertest(app)
                    .get('/api/threads')
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedThreads);
            });
        });
    });

    describe(`GET /api/threads/:thread_id`, () => {
        context('Should return 200 and given thread', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Responds with 200 and given thread item', () => {
                const threadId = 1;
                let expectedThread = testThreads[threadId - 1];

                return supertest(app)
                    .get(`/api/threads/${threadId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedThread);
            });
        });
    });

    describe(`GET /api/threads/category/:category_id`, () => {
        context('Should return 200 and given thread', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Responds with 200 and given thread item', () => {
                let categoryId = 1;
                let tempThreads = testThreads.filter(thread => thread.category === categoryId);

                return supertest(app)
                    .get(`/api/threads/category/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, tempThreads);
            });
        });
    });

    describe(`GET /api/threads/user/:user_id`, () => {
        context('Given valid user', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('responds with 200 and corresponding threads', () => {
                const userId = 1;
                let tempThreads = testThreads.filter(thread => thread.user_id === userId);

                return supertest(app)
                    .get(`/api/threads/user/${userId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[userId - 1]))
                    .expect(200, tempThreads);
            });
        });
    });

    describe(`POST /api/threads`, () => {
        context('Should return 201 and the posted thread', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Responds with 201 and added thread item', () => {
                const newThread = {
                    id: 4,
                    title: "Test thread 4",
                    user_id: 1,
                    category: 3,
                    date_created: new Date().toISOString(),
                    content: 'Hello world 4'
                };

                return supertest(app)
                    .post(`/api/threads`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .send(newThread)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.an('object')
                        expect(res.body.title).to.eql(newThread.title)
                        expect(res.body.user_id).to.eql(newThread.user_id)
                        expect(res.body.category).to.eql(newThread.category)
                        expect(res.body.date_created).to.eql(newThread.date_created)
                        expect(res.body.content).to.eql(newThread.content)
                    })
                    .then(res => {
                        return supertest(app)
                            .get(`/api/threads/${newThread.id}`)
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(newThread);
                    });
            });
        });
    });

    describe(`DELETE /api/threads/:thread_id`, () => {
        context('Given no threads', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Responds with 404', () => {
                const threadId = 123456;

                return supertest(app)
                    .delete(`/api/threads/${threadId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(404);
            });
        });

        context('Given thread in database', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Responds with 204 and removes thread', () => {
                const idToDelete = 1;
                let expectedThreads = testThreads.filter(thread => thread.id !== idToDelete);

                return supertest(app)
                    .delete(`/api/threads/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/threads')
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(expectedThreads);
                    });
            });
        });
    });

    describe(`PATCH /api/threads/:thread_id`, () => {
        context('Given a valid user', () => {
            beforeEach('insert test threads', () => {
                return helpers.seedThreads(
                    db,
                    testThreads,
                    testCategories,
                    testUsers
                );
            });

            it('Should respond with 202 with updated item', () => {
                const idToChange = 1;
                const threadToUpdate = testThreads[idToChange - 1];
                const category = testCategories.find(cat => cat.id === threadToUpdate.category);
                const newThread = Object.assign(threadToUpdate, { title: 'New Thread Who Dis' });
                const expectedThread = { ...newThread, category: category.name };

                return supertest(app)
                    .patch(`/api/threads/${idToChange}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .send(newThread)
                    .expect(202)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/threads/${idToChange}`)
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(200, newThread);
                    });
            });
        })
    });
});