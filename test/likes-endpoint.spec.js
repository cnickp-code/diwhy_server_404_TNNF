const helpers = require('./test-helpers');
const app = require('../src/app');
const supertest = require('supertest');
const { expect } = require('chai');

describe(`Likes Endpoints`, () => {
    let db;

    const testThreads = helpers.makeThreadsArray();
    const testCategories = helpers.makeCategoriesArray();
    const testUsers = helpers.makeUsersArray();
    const testLikes = helpers.makeLikesArray();
    const validUser = testUsers[0];

    before('make knex instance', () => {
        db = helpers.makeKnexInstance();
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());
    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`POST /api/likes`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedLikes(
                db,
                testLikes,
                testThreads,
                testUsers,
                testCategories
            )
        });

        it('Responds 201 with the inserted like', () => {
            const newLike = {
                id: 4,
                thread_id: 2,
                user_id: 1,
            };

            let expectedLikes = [...testLikes, newLike];
            expectedLikes = expectedLikes.filter(like => like.thread_id === newLike.thread_id);
            // let count = 0;
            // expectedLikes.forEach(like => {
            //     if(like.thread_id === newLike.thread_id) {
            //         count++;
            //     }
            // })
            // count = count.toString();

            return supertest(app)
                .post(`/api/likes`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .send(newLike)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.thread_id).to.be.eql(newLike.thread_id)
                    expect(res.body.user_id).to.be.eql(newLike.user_id);
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/likes/thread/${newLike.thread_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedLikes);
                });
        });
    });

    describe(`DELETE /api/likes/thread/:thread_id`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedLikes(
                db,
                testLikes,
                testThreads,
                testUsers,
                testCategories
            )
        });

        it('Responds 204 for deleted like', () => {
            const threadId = 1;
            const likeId = 1;

            let expectedLikes = testLikes.filter(like => like.id !== likeId);
            let deletedLike = testLikes.find(like => like.id === likeId);
            expectedLikes = expectedLikes.filter(like => deletedLike.thread_id === like.thread_id);
            // let count = expectedLikes.length.toString();

            return supertest(app)
                .delete(`/api/likes/thread/${threadId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/likes/thread/${deletedLike.thread_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedLikes);
                });
        });
    });

    describe(`GET /api/likes/thread/:thread_id`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedLikes(
                db,
                testLikes,
                testThreads,
                testUsers,
                testCategories

            )
        });

        it('Responds with 200 and corresponding likes', () => {
            const threadId = 1;
            let count = 0;
            let expectedLikes = testLikes.filter(like => like.thread_id === threadId);
            // testLikes.forEach(like => {
            //     if(like.thread_id === threadId){
            //         count++;
            //     }
            // })
            // count = count.toString();
            // tempLikes = tempLikes.map(like => {
            // })

            return supertest(app)
                .get(`/api/likes/thread/${threadId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(200, expectedLikes);
        });
    });
});