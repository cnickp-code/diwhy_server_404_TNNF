const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('User Endpoints', function () {
    let db

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/user/:user_name`, () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers))


        it('Responds with 200 and corresponding user info', () => {
            const user_name = 'test-user-1';
            let expectedUser = testUsers.find(user => user.user_name === user_name)
    
            delete expectedUser.password;

            expectedUser = {
                ...expectedUser,
                endorsements: 0,
                profile_pic: 'https://i.pinimg.com/originals/f9/4f/37/f94f37eb1fbdfb5d49dc97e711a35289.jpg'
            }

            return supertest(app)
            .get(`/api/user/${user_name}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(200, expectedUser)
        })

    })

    describe(`POST /api/user`, () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

        const requiredFields = ['user_name', 'password', 'email']

        requiredFields.forEach(field => {
            const registerAttemptBody = {
                user_name: 'test username',
                password: 'testpassword',
                email: 'test@email.com',
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete registerAttemptBody[field]

                return supertest(app)
                    .post('/api/user')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })

        it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
            const userShortPassword = {
                user_name: 'test username',
                password: '1234567',
                email: 'test@email.com',
            }
            return supertest(app)
                .post('/api/user')
                .send(userShortPassword)
                .expect(400, { error: `Password be longer than 8 characters` })
        })

        it(`responds 400 'Password be less than 72 characters' when long password`, () => {
            const userLongPassword = {
                user_name: 'test username',
                password: '*'.repeat(73),
                email: 'test@email.com',
            }
            return supertest(app)
                .post('/api/user')
                .send(userLongPassword)
                .expect(400, { error: `Password be less than 72 characters` })
        })

        it(`responds 400 error when password starts with spaces`, () => {
            const userPasswordStartsSpaces = {
                user_name: 'test username',
                password: ' 1Aa!2Bb@',
                email: 'test@email.com',
            }
            return supertest(app)
                .post('/api/user')
                .send(userPasswordStartsSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password ends with spaces`, () => {
            const userPasswordEndsSpaces = {
                user_name: 'test username',
                password: '1Aa!2Bb@ ',
                email: 'test@email.com',
            }
            return supertest(app)
                .post('/api/user')
                .send(userPasswordEndsSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 'User name already taken' when username isn't unique`, () => {
            const duplicateUser = {
                user_name: testUser.user_name,
                password: '11AAaa!!',
                email: 'test@email.com',
            }
            return supertest(app)
                .post('/api/user')
                .send(duplicateUser)
                .expect(400, { error: `Username already taken` })
        })

        describe(`Given a valid user`, () => {
            it(`responds with 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAaa!!',
                    email: 'test@test.com',
                }
            

                return supertest(app)
                    .post('/api/user')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        // console.log(res.body)
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)

                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(res.body.user_name).to.eql(newUser.user_name)
                                expect(res.body.email).to.eql(newUser.email)
                                expect(res.body).to.not.have.property('password')
                                expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)

                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(res.body.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})