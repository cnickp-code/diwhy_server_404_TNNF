const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

describe(`Postings Endpoints`, () => {
    let db


    const testPostings = helpers.makePostingsArray();
    const testCategories = helpers.makeCategoriesArray()
    const testUsers = helpers.makeUsersArray()
    const validUser = testUsers[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/postings`, () => {
        context(`Given valid user`, () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            const expectedPostings = testPostings.map(posting => {
                let user = testUsers.find(user => user.id === posting.user_id);

                let newObj = {
                    ...posting,
                    user_name: user.user_name
                }

                return newObj
            })
            // console.log('Expected posting: ', expectedPostings);

            it('responds with 200 and corresponding postings', () => {
                return supertest(app)
                    .get('/api/postings')
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedPostings);
            })
        })
    })

    describe(`GET /api/postings/:posting_id`, () => {
        context('Should return 200 and given posting', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('Responds with 200 and given posting', () => {
                const postingId = 1;
                let expectedPosting = testPostings[postingId - 1];
                let user = testUsers.find(user => user.id === expectedPosting.user_id);

                expectedPosting = {
                    ...expectedPosting,
                    user_name: user.user_name
                }

                return supertest(app)
                    .get(`/api/postings/${postingId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedPosting)
            })
        })
    })

    describe(`GET /api/postings/category/:category_id`, () => {
        context('Should return 200 and given posting', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('Respond with 200 and given posting', () => {
                let categoryId = 1
                let tempPostings = testPostings.filter(posting => posting.category === categoryId)

                tempPostings = tempPostings.map(posting => {
                    let user = testUsers.find(user => user.id === posting.user_id);

                    let newObj = {
                        ...posting,
                        user_name: user.user_name
                    }

                    return newObj
                })

                return supertest(app)
                    .get(`/api/postings/category/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, tempPostings)
            })
        })
    })

    describe(`GET /api/postings/user/:user_id`, () => {
        context('Given valid user', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('responds with 200 and corresponding postings', () => {
                const userId = 1;
                let tempPostings = testPostings.filter(posting => posting.user_id === userId)

                tempPostings = tempPostings.map(posting => {
                    let user = testUsers.find(user => user.id === posting.user_id);

                    let newObj = {
                        ...posting,
                        user_name: user.user_name
                    }

                    return newObj
                })

                return supertest(app)
                    .get(`/api/postings/user/${userId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, tempPostings)
            })
        })
    })

    describe(`POST /api/postings`, () => {
        context('Should return 201 and the posting', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })


            it('Responds with 201 and added posting', () => {
                const newPosting = {
                    id: 4,
                    title: 'Test posting 4',
                    user_id: 1,
                    category: 1,
                    date_created: new Date().toISOString(),
                    content: 'Hello world 4'
                }

                let user = testUsers.find(user => user.id === newPosting.user_id);

                let expectedPosting = {
                    ...newPosting,
                    user_name: user.user_name
                }

                return supertest(app)
                .post(`/api/postings`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .send(newPosting)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.title).to.eql(newPosting.title)
                    expect(res.body.user_id).to.eql(newPosting.user_id)
                    expect(res.body.category).to.eql(newPosting.category)
                    expect(res.body.date_created).to.eql(newPosting.date_created)
                    expect(res.body.content).to.eql(newPosting.content)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/postings/${newPosting.id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(expectedPosting)
                })
            })

        })
    })

    describe(`DELETE /api/postings/:posting_id`, () => {
        context('Given no postings', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('Responds with 404', () => {
                const postingId = 123456;

                return supertest(app)
                    .delete(`/api/postings/${postingId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(404)
            })
        })

        context('Given postings in database', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('Responds with 204 and removes posting', () => {
                const idToDelete = 1;
                let tempPostings = testPostings.filter(posting => posting.id !== idToDelete)

                tempPostings = tempPostings.map(posting => {
                    let user = testUsers.find(user => user.id === posting.user_id);

                    let newObj = {
                        ...posting,
                        user_name: user.user_name
                    }

                    return newObj
                })
                return supertest(app)
                    .delete(`/api/postings/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/postings')
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(tempPostings)
                    })
            })
        })
    })

    describe(`PATCH /api/postings/:posting_id`, () => {
        context('Given a valid user', () => {
            beforeEach('insert postings', () => {
                return helpers.seedPostings(
                    db,
                    testPostings,
                    testCategories,
                    testUsers
                )
            })

            it('Should respond with 202 with updated item', () => {
                const idToChange = 1;
                const postingToUpdate = testPostings[idToChange - 1];
                let newPosting = {
                    ...postingToUpdate,
                    title: 'New Posting Who Dis',
                    content: 'New Content Who Dat'
                }

                let user = testUsers.find(user => user.id === newPosting.user_id);
                newPosting = {
                    ...newPosting,
                    user_name: user.user_name
                }

                return supertest(app)
                    .patch(`/api/postings/${idToChange}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .send(newPosting)
                    .expect(202)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/postings/${idToChange}`)
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(200, newPosting)
                    })
            })
        })
    })
})