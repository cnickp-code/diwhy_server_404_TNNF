const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

describe(`Likes Endpoints`, () => {
    let db

    const testThreads = helpers.makeThreadsArray();
    const testCategories = helpers.makeCategoriesArray()
    const testUsers = helpers.makeUsersArray()
    const testLikes = helpers.makeLikesArray()
    const validUser = testUsers[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/likes`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedLikes(
                db,
                testLikes,
                testThreads,
                testCategories,
                testUsers
            )
        })

        it('Responds 201 with the inserted like', () => {
            const newLike = {
                id: 4,
                thread_id: 2,
                user_id: 2,
            }

            return supertest(app)
                .post(`/api/likes`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .send(newLike)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.thread_id).to.be.eql(newLike.thread_id)
                    expect(res.body.user_id).to.be.eql(newLike.user_id)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/likes/${newLike.id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(newLike)
                })
        })
    })

    describe(`DELETE /api/likes/:id`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedLikes(
                db,
                testLikes,
                testThreads,
                testCategories,
                testUsers
            )
        })

        it('Responds 204 for deleted like', () => {
            const likeId = 1;

            let expectedLikes = testLikes.filter(like => like.id !== likeId)
            let deletedLike = testLikes.find(like => like.id === likeId)
            expectedLikes = expectedLikes.filter(like => deletedLike.thread_id === like.thread_id)

            return supertest(app)
                .delete(`/api/likes/${likeId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/thread/${deletedLike.thread_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedLikes)
                })
        })

    })
})