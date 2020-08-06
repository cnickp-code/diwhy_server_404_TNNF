const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

const { makeCategoriesArray, makeUsersArray } = require('./test-helpers');
const { expect } = require('chai');

describe('Categories Endpoints', () => {
    let db;

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

    before('clean db', () => helpers.cleanTables(db));
    afterEach('clean db', () => helpers.cleanTables(db));
    after('end connection', () => db.destroy());

    describe('GET /api/categories', () => {
        // it('Should return 200 and empty array', () => {
        //     return supertest(app)
        //         .get('/api/events')
        //         .expect(200, []);
        // })

        context('With data in the table', () => {
            beforeEach('Insert categories', () => {
                return db
                    .into('categories')
                    .insert(testCategories)
            })

            it('Should return 200 and test data', () => {
            return supertest(app)
                .get('/api/categories')
                .expect(200, testCategories)
            })
        })


    })

    describe('GET /api/categories/:category_id', () => {
        beforeEach('Insert categories', () => {
            return db
                .into('categories')
                .insert(testCategories)
        })

        it('Responds with 200 and given category', () => {
            const categoryId = 1;
            const expectedCategory = testCategories[categoryId - 1];

            return supertest(app)
                .get(`/api/categories/${categoryId}`)
                .expect(200, expectedCategory)
        })
    })
})