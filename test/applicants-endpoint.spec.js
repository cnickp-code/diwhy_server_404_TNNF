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
    const testCategories = helpers.makeCategoriesArray();
    const testUsers = helpers.makeUsersArray();
    const validUser = testUsers[0];

    before('make knex instance', () => {
        db = helpers.makeKnexInstance();
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));


    describe(`GET /api/applicants/postings/:posting_id`, () => {
        beforeEach('seed tables', () => {
            return helpers.seedApplicants(
                db,
                testApplicants,
                testPostings,
                testUsers,
                testCategories,
            );
        });

        it('responds 200 with all applicants for that posting', () => {
            let postingId = 1;
            let expectedApplicants = testApplicants.filter(app => app.posting_id === postingId);
            expectedApplicants = expectedApplicants.map(app => {
                let user = testUsers.find(user => user.id === app.applicant_id);
                let newUser = {
                    email: user.email,
                    endorsements: 0,
                    user_name: user.user_name
                };

                let newObj = {
                    ...app,
                    user: newUser
                };

                delete newObj['applicant_id'];

                return newObj;
            })

            return supertest(app)
                .get(`/api/applicants/postings/${postingId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(200, expectedApplicants);
        });
    });

    describe(`GET /api/applicants/user/:user_id`, () => {
        beforeEach('seed tables', () => {
            return helpers.seedApplicants(
                db,
                testApplicants,
                testPostings,
                testUsers,
                testCategories,
            );
        });

        it(`Responds with 200 and given data`, () => {
            let userId = 1;
            let expectedApplications = testApplicants.filter(app => app.applicant_id === userId)

            expectedApplications = expectedApplications.map(app => {
                let user = testUsers.find(user => user.id === app.applicant_id)
                let newUser = {
                    email: user.email,
                    endorsements: 0,
                    user_name: user.user_name
                };

                let newObj = {
                    ...app,
                    user: newUser
                };

                delete newObj['applicant_id'];

                return newObj;
            });

            return supertest(app)
                .get(`/api/applicants/user/${userId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(200, expectedApplications);
        });
    });

    describe(`POST /api/applicants`, () => {
        beforeEach('seed tables', () => {
            return helpers.seedApplicants(
                db,
                testApplicants,
                testPostings,
                testUsers,
                testCategories,
            );
        });

        it('Responds with 201 and inserted application', () => {
            let newApp = {
                id: 4,
                content: 'Hello there',
                applicant_id: 2,
                posting_id: 2
            };

            let expectedApps = testApplicants.filter(app => app.posting_id === newApp.posting_id);

            expectedApps.push(newApp);

            expectedApps = expectedApps.map(app => {
                let user = testUsers.find(user => user.id === app.applicant_id);
                let newUser = {
                    email: user.email,
                    endorsements: 0,
                    user_name: user.user_name
                };

                let newObj = {
                    ...app,
                    user: newUser
                };

                delete newObj['applicant_id'];

                return newObj;
            });

            return supertest(app)
                .post(`/api/applicants`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .send(newApp)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.content).to.eql(newApp.content)
                    expect(res.body.applicant_id).to.eql(newApp.applicant_id)
                    expect(res.body.posting_id).to.eql(newApp.posting_id)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/applicants/postings/${newApp.posting_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedApps)
                });
        });
    });

    describe(`DELETE /api/applicants/:id`, () => {
        beforeEach('seed tables', () => {
            return helpers.seedApplicants(
                db,
                testApplicants,
                testPostings,
                testUsers,
                testCategories,
            );
        });

        it(`Responds 204 for deleted comment`, () => {
            const appId = 1;
            let testApp = testApplicants[appId - 1];

            let expectedApplicants = testApplicants.filter(app => app.id !== appId);
            expectedApplicants = expectedApplicants.filter(app => app.applicant_id === testApp.applicant_id);

            expectedApplicants = expectedApplicants.map(app => {
                let user = testUsers.find(user => user.id === app.applicant_id)
                let newUser = {
                    email: user.email,
                    endorsements: 0,
                    user_name: user.user_name
                };

                let newObj = {
                    ...app,
                    user: newUser
                };
                delete newObj['applicant_id'];

                return newObj;
            });

            return supertest(app)
                .delete(`/api/applicants/${appId}`)
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/applicants/user/${testApp.applicant_id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(200, expectedApplicants);
                });
        });
    });
});

