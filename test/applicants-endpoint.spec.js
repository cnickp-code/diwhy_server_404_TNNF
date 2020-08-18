const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');
const applicantsRouter = require('../src/posting_applicants/posting_applicants-router');

describe('Applicants endpoints', () => {
    let db;

    const testApplicants = helpers.makeApplicantsArray();
    const testPostings = helpers.makePostingsArray();
    const testCatergories = helpers.makeCategoriesArray();
    const testUsers = helpers.makeUsersArray();
    const validUser = testUsers[0];

    const table_name = 'posting-applicants';
    const endpoint = '/applicants';

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

    describe(`GET ${endpoint}/postings/:posting_id`, () => {
        beforeEach('seed tables', () => {
            helpers.seedApplicants(
                db,
                testApplicants,
                testPostings,
                testCatergories,
                testUsers,
            )
        })

        it('responds 200 with all applicants for that posting', () => {
            const 
        })
    })

    describe(`POST ${endpoint}/`, () => {
        return helpers.seedPostings(
            db,
            testPostings,
            testCatergories,
            testUsers
        )
    })

        it('responds 201 with a new applicant', () => {
        const newApplicant = {
        
    }

    })
})

