const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

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
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/threads`, () => {
        context('Given valid user', () => {
            
        })
    })

    describe(`GET /api/threads/:thread_id`, () => {
        
    })

    describe(`GET /api/threads/category/:category_id`, () => {
        
    })

    describe(`GET /api/threads/user/:user_id`, () => {
        
    })

    describe(`POST /api/threads`, () => {
        
    })

    describe(`DELETE /api/threads/:thread_id`, () => {
        
    })

    describe(`PATCH /api/threads/:thread_id`, () => {
        
    })
})