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
        beforeEach('insert test comments, threads, users, categories', () => {
            return helpers.seedThreads(
                db,
                testThreads,
                testCategories,
                testUsers
            )
        })

        it('responds 201 with the inserted comment', () => {
            let date = new Date().toISOString();
            const newComment = {
                id: 3,
                content: 'test comment 3',
                date_created: date,
                user_id: 1,
                thread_id: 1
            }

            let user = testUsers.find(user => user.id === newComment.user_id);

            let expectedComment = {
                ...newComment,
                user_name: user.user_name
            }
            return supertest(app)
                .post(`/api/comments`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newComment)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.content).to.be.eql(newComment.content)
                    expect(res.body.date_created).to.be.eql(newComment.date_created)
                    expect(res.body.user_id).to.be.eql(newComment.user_id)
                    expect(res.body.thread_id).to.be.eql(newComment.thread_id)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/comments/${newComment.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(expectedComment)
                })
        })
    })

    describe(`GET /api/comments/:thread`, () => {
        beforeEach('insert comments, threads, users, categories', () => 
            helpers.seedComments(
                db, 
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        )
        
        

        it('responds 200 with the comments for that thread', () => {
            const threadId = 1
            let expectedComments = testComments.filter(comment => comment.thread_id === threadId)

            expectedComments = expectedComments.map(comment => {
                let user = testUsers.find(user => user.id === comment.user_id)

                let newObj = {
                    ...comment,
                    user_name: user.user_name
                }

                return newObj
            })

            return supertest(app)
                .get(`/api/comments/thread/${threadId}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, expectedComments)
        })
    })

    describe(`DELETE /api/comments/:id`, () => {
        beforeEach('insert comments, threads, users, categories', () => 
            helpers.seedComments(
                db, 
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        )
        it('responds 204 for deleted comment', () => {
            const threadId = 1;
            const commentId = 1;
            let expectedComments = testComments.filter(comment => comment.id !== commentId);

            expectedComments = expectedComments.map(comment => {
                let user = testUsers.find(user => user.id === comment.user_id)
                
                let newObj = {
                    ...comment,
                    user_name: user.user_name
                }

                return newObj;
            })
            
            return supertest(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/comments/thread/${threadId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, expectedComments)
                })
        })
    })

    describe(`PATCH /api/comments/:id`, () => {
        beforeEach('insert comments, threads, users, categories', () => 
            helpers.seedComments(
                db, 
                testComments,
                testThreads,
                testUsers,
                testCategories
            )
        )
        it('responds 202 with the updated comment', () => {
            const commentId = 1;
            const expectedUpdate = {
                id: 1,
                content: 'update content',
                date_created: testComment.date_created,
                user_id: 1,
                thread_id: 1
            }

            let user = testUsers.find(user => user.id === expectedUpdate.user_id)

            let expectedComment = {
                ...expectedUpdate,
                user_name: user.user_name
            }


            return supertest(app)
                .patch('/api/comments/1')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(expectedUpdate)
                .then(res => {
                    return supertest(app)
                        .get(`/api/comments/${commentId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, expectedComment)
                })
        })
    })
})