const xss = require('xss');

const ThreadsService = {
    getAllThreads(knex) {
        return knex
            .select('*')
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .join('users', 'users.id', 'user_id')
            .select(
                knex.raw(
                    'threads.id AS thread_id'
                )
            )
            .select('users.date_created AS user_created')
            .orderBy('thread_id');
    },
    getThreadById(knex, id) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .join('users', 'users.id', 'user_id')
            .select('*')
            .select('threads.id AS thread_id')
            .select('users.date_created AS user_created')
            .where('threads.id', id)
            .first();
    },
    getThreadsByUserId(knex, userId) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .join('users', 'users.id', 'user_id')
            .select('*')
            .select(
                knex.raw(
                    'threads.id AS thread_id'
                )
            )
            .select('users.date_created AS user_created')
            .where('user_id', userId)
            .orderBy('thread_id');
    },
    getThreadsByCategoryId(knex, catId) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .join('users', 'users.id', 'user_id')
            .select('*')
            .select(
                knex.raw(
                    'threads.id AS thread_id'
                )
            )
            .select('users.date_created AS user_created')
            .where('category', catId)
            .orderBy('thread_id');
    },
    insertThread(knex, newThread) {
        return knex
            .insert(newThread)
            .into('threads')
            // .join('categories', 'categories.id', 'category')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deleteThread(knex, id) {
        return knex('threads')
            .where({ id })
            .delete();
    },
    updateThread(knex, id, modifiedThread) {
        return knex('threads')
            .where({ id })
            .update(modifiedThread);
    },
    serializeThread(thread) {
        return {
            id: thread.thread_id,
            title: thread.title,
            user_id: thread.user_id,
            user_name: thread.user_name,
            user_pic: thread.profile_pic,
            category: thread.category,
            date_created: thread.date_created,
            content: thread.content
        };
    }
};

module.exports = ThreadsService