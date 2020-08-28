const helpers = require('./test-helpers');
const app = require('../src/app');
const supertest = require('supertest');

describe(`Interests endpoints`, () => {
    let db;

    const testInterests = helpers.makeInterestsArray();
    const testCategories = helpers.makeCategoriesArray();
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = helpers.makeKnexInstance();
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/interests`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        );

        beforeEach('insert categories', () =>
            helpers.seedCategories(
                db,
                testCategories
            )
        );

        beforeEach('insert interests', () =>
            helpers.seedUserInterests(
                db,
                testInterests
            )
        );

        it('should return user interests', () => {
            const testInterestsDetails = [
                {
                    id: 1,
                    user_id: 1,
                    category: 'Woodworking'
                },
                {
                    id: 2,
                    user_id: 1,
                    category: 'Needlecraft'
                },
                {
                    id: 3,
                    user_id: 1,
                    category: 'Metalworking'
                }
            ];
            return supertest(app)
                .get('/api/interests')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(testInterestsDetails);
        });
    });

    describe(`POST /api/interests`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        );

        beforeEach('insert categories', () =>
            helpers.seedCategories(
                db,
                testCategories
            )
        );

        it('responds users', () => {
            const newInterest = {
                id: 4,
                user_id: 1,
                category_id: 4
            }
            return supertest(app)
                .post('/api/interests')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newInterest)
                .expect(200)
        });
    });

    describe(`DELETE /api/interests/:id`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        );

        beforeEach('insert categories', () =>
            helpers.seedCategories(
                db,
                testCategories
            )
        );

        beforeEach('insert interests', () =>
            helpers.seedUserInterests(
                db,
                testInterests
            )
        );

        it('deletes interest responds with 204', () => {
            return supertest(app)
                .delete('/api/interests/1')
                .expect(204)
        });
    });
});