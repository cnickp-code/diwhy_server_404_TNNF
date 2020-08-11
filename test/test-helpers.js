const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeKnexInstance() {
    return knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            email: 'testuser1@test.com',
            password: 'password',
        },
        {
            id: 2,
            user_name: 'test-user-2',
            email: 'testuser2@test.com',
            password: 'password',
        },
    ]
}

function makeCategoriesArray() {
    return [
        {
            id: 1,
            name: 'Woodworking',
        },
        {
            id: 2,
            name: 'Needlecraft',
        },
        {
            id: 3,
            name: 'Metalworking',
        },
        {
            id: 4,
            name: 'Arts and Crafts', 
        },
    ]
}

function makeInterestsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            category_id: 1
        },
        {
            id: 2,
            user_id: 1,
            category_id: 2
        },
        {
            id: 3,
            user_id: 1,
            category_id: 3
        }
    ]
}

function makeThreadsArray() {
    return [
        {
            id: 1,
            title: 'Test thread 1',
            user_id: 1,
            category: 1,
            date_created: new Date().toISOString(),
            content: 'Hello world 1'
        },
        {
            id: 2,
            title: 'Test thread 2',
            user_id: 2,
            category: 2,
            date_created: new Date().toISOString(),
            content: 'Hello world 2'
        },
        {
            id: 3,
            title: 'Test thread 3',
            user_id: 2,
            category: 3,
            date_created: new Date().toISOString(),
            content: 'Hello world 3'
        },
    ]
}

function makePostingsArray() {
    return [
        {
            id: 1,
            title: 'Test posting 1',
            user_id: 1,
            category: 1,
            date_created: new Date().toISOString(),
            content: 'Hello world 1'
        },
        {
            id: 2,
            title: 'Test posting 2',
            user_id: 2,
            category: 2,
            date_created: new Date().toISOString(),
            content: 'Hello world 2'
        },
        {
            id: 3,
            title: 'Test posting 3',
            user_id: 2,
            category: 3,
            date_created: new Date().toISOString(),
            content: 'Hello world 3'
        },
    ]
}

function seedUserInterests(db, interests) {
    return db
        .insert(interests)
        .into('users_interests')
}

function seedCategories(db, categories) {
    return db
        .insert(categories)
        .into('categories')
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ userId: user.id, email: user.email, user_name: user.user_name }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => {
        let { id, ...newUser } = user;
        newUser.password = bcrypt.hashSync(user.password, 12);

        return newUser;
    })
    return db
        .into('users')
        .insert(preppedUsers)
        .then(() => db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]))
}

function seedThreadsCompact(db, threads) {
    return db
        .insert(threads)
        .into('threads')
}

function seedThreads(db, threads, categories, users) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('categories').insert(categories.map(category => {
            let { id, ...newCategory } = category;

            return newCategory;
        }))
        await trx.raw(`SELECT setval('categories_id_seq', ?)`, [categories[categories.length - 1].id])
        await trx.into('threads').insert(threads.map(thread => {
            let { id, ...newThread } = thread;

            return newThread;
        }))
        await trx.raw(`SELECT setval('threads_id_seq', ?)`, [threads[threads.length - 1].id])
    
    })
}

function seedPostings(db, postings, categories, users) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('categories').insert(categories.map(category => {
            let { id, ...newCategory } = category;

            return newCategory;
        }))
        await trx.raw(`SELECT setval('categories_id_seq', ?)`, [categories[categories.length - 1].id])
        await trx.into('postings').insert(postings.map(posting => {
            let { id, ...newPosting } = posting;

            return newPosting;
        }))
        await trx.raw(`SELECT setval('postings_id_seq', ?)`, [postings[postings.length - 1].id])
    
    })
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `
            TRUNCATE posting_applicants CASCADE;
            TRUNCATE postings CASCADE;
            TRUNCATE comments CASCADE;
            TRUNCATE threads CASCADE;
            TRUNCATE users_interests CASCADE;
            TRUNCATE categories CASCADE;
            TRUNCATE users CASCADE;
            `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE posting_applicants_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE postings_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE threads_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE users_interests_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE categories_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('posting_applicants_id_seq', 0)`),
                    trx.raw(`SELECT setval('postings_id_seq', 0)`),
                    trx.raw(`SELECT setval('comments_id_seq', 0)`),
                    trx.raw(`SELECT setval('threads_id_seq', 0)`),
                    trx.raw(`SELECT setval('users_interests_id_seq', 0)`),
                    trx.raw(`SELECT setval('categories_id_seq', 0)`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                ])
            )
    )
}

module.exports = {
    makeKnexInstance,
    makeUsersArray,
    makeCategoriesArray,
    makeAuthHeader,
    makeInterestsArray,
    makeThreadsArray,
    makePostingsArray,
    cleanTables,
    seedUsers,
    seedCategories,
    seedUserInterests,
    seedThreads,
    seedThreadsCompact,
    seedPostings
}