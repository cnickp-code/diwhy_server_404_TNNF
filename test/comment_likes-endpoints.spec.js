const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

describe(`Comment Likes Endpoints`, () => {
    let db

    const testCommentLikes = helpers.makeCommentLikesArray();
    const testComments = helpers.makeCommentsArray();
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
            return helpers.seedCommentLikes(
                db,
                testCommentLikes,
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        })

        it('Responds with 201 with the inserted comment like', () => {
            const newLike = {
                id: 4,
                comment_id: 2,
                user_id: 1,
            }

            let expectedLikes = [...testCommentLikes, newLike]
            expectedLikes = expectedLikes.filter(like => like.comment_id === newLike.comment_id)

            return supertest(app)
                .post(`/api/comment_likes`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .send(newLike)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.comment_id).to.be.eql(newLike.comment_id)
                    expect(res.body.user_id).to.be.eql(newLike.user_id)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/comment_likes/comment/${newLike.comment_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedLikes)
                })
        })

    })

    describe(`DELETE /api/comment_likes/comment/:comment_id`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedCommentLikes(
                db,
                testCommentLikes,
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        })

        it(`Responds with 204 for deleted like`, () => {
            const commentId = 1;
            const likeId = 1;

            let expectedLikes = testCommentLikes.filter(like => like.id !== likeId)
            expectedLikes = expectedLikes.filter(like => like.comment_id === commentId)

            return supertest(app)
                .delete(`/api/comment_likes/comment/${commentId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/comment_likes/comment/${commentId}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        expect(200, expectedLikes)
                })
        })
    })

    describe(`GET /api/comment_likes/comment/:comment_id`, () => {
        beforeEach('insert test likes, threads, users, categories', () => {
            return helpers.seedCommentLikes(
                db,
                testCommentLikes,
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        })

        it('Responds with 200 and corresponding comment likes', () => {
            const commentId = 1;
            let expectedLikes = testCommentLikes.filter(like => like.comment_id === commentId)

            return supertest(app)
                .get(`/api/comment_likes/comment/${commentId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(200, expectedLikes)
        })
    })
})