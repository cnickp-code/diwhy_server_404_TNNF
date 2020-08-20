const helpers = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

describe(`Messaging Endpoints`, () => {
    let db

    const testUsers = helpers.makeUsersArray()
    const validUser = testUsers[0]
    const testMessages = helpers.makeMessagesArray();

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/messaging`, () => {
        context(`Given valid user`, () => {
            beforeEach('insert messages', () => {
                return helpers.seedMessages(
                    db,
                    testMessages,
                    testUsers
                )
            })

            const expectedMessages = testMessages.map(msg => {
                let user = testUsers.find(user => user.id === msg.user_id);

                let newObj = {
                    ...msg,
                    user_name: user.user_name
                }

                return newObj
            })

            it('responds with 200 and corresponding messages', () => {
                return supertest(app)
                    .get('/api/messaging')
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedMessages)
            })
        })
    })

    describe(`GET /api/messaging/user/:user_id`, () => {
        context('Given valid user', () => {
            beforeEach('insert messages', () => {
                return helpers.seedMessages(
                    db,
                    testMessages,
                    testUsers
                )
            })

            it('Responds with 200 and corresponding messages', () => {
                const userId = 1;
                let expectedMessages = testMessages.filter(msg => msg.user_id === userId)

                expectedMessages = expectedMessages.map(msg => {
                    let user = testUsers.find(user => user.id === msg.user_id);
    
                    let newObj = {
                        ...msg,
                        user_name: user.user_name
                    }
    
                    return newObj
                })

                return supertest(app)
                    .get(`/api/messaging/user/${userId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedMessages)
            })
        })
    })
})