const xss = require('xss')

const ThreadsService = {
    getAllThreads(knex) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .select('*')
            .select(
                knex.raw(
                    'threads.id AS thread_id'
                )
            )
            .orderBy('thread_id')
    },
    getThreadById(knex, id) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .select('*')
            .select('threads.id AS thread_id')
            .where('threads.id', id)
            .first()
    },
    getThreadsByUserId(knex, userId) {
        return knex
            .from('threads')
            .join('categories', 'categories.id', 'category')
            .select('*')
            .select(
                knex.raw(
                    'threads.id AS thread_id'
                )
            )
            .where('user_id', userId)
            .orderBy('thread_id')
    },
    getThreadsByCategoryId(knex, catId) {
        return knex
            .select('threads.*')
            .join('categories', 'categories.id', 'category_id')
            .select('*')
            .select(
                knex.raw(
                    '"threads"."id" AS "thread_id"'
                )
            )
            .where('category_id', catId)
            .orderBy('thread_id')
    },
    insertThread(knex, newThread) {
        return knex
            .insert(newThread)
            .into('threads')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteThread(knex, id) {
        return knex('threads')
            .where({ id })
            .delete();
    },
    updateThread(knex, id, modifiedThread) {
        return knex('threads')
            .where({ id })
            .update(modifiedThread)
    },
    serializeThread(thread) {
        return {
            id: thread.id,
            title: thread.title,
            user_id: thread.user_id,
            category: thread.name,
            date_created: thread.date_created,
            content: thread.content
        }
    }
}

module.exports = ThreadsService;