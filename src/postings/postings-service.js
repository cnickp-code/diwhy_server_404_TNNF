const PostingsService = {
    getAllPostings(db) {
        return db
            .select('*')
            .from('postings')
            .join('users', 'users.id', 'user_id')
            .select('postings.id AS posting_id')
            .select('users.date_created AS user_created')
            .orderBy('posting_id')
    },
    getPostingsByCategory(db, category_id) {
        return db
            .select('*')
            .from('postings')
            .join('users', 'users.id', 'user_id')
            .select('postings.id AS posting_id')
            .select('users.date_created AS user_created')
            .where({ category: category_id })
            .orderBy('posting_id')
    },
    getPostingsByUser(db, user_id) {
        return db
            .select('*')
            .from('postings')
            .join('users', 'users.id', 'user_id')
            .select('postings.id AS posting_id')
            .select('users.date_created AS user_created')
            .where({ user_id })
            .orderBy('posting_id')
    },
    getPostingById(db, id) {
        return db
            .select('*')
            .from('postings')
            .join('users', 'users.id', 'user_id')
            .select('postings.id AS posting_id')
            .select('users.date_created AS user_created')
            .where('postings.id', id)
            .orderBy('posting_id')
            .first()
    },
    deletePosting(db, id) {
        return db
            .from('postings')
            .where({ id })
            .delete()
    },
    insertPosting(db, newPosting) {
        return db
            .insert(newPosting)
            .into('postings')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updatePosting(db, id, data) {
        return db
            .from('postings')
            .where({ id })
            .update(data)
    },
    serializePosting(posting) {
        return {
            id: posting.posting_id,
            title: posting.title,
            user_id: posting.user_id,
            user_name: posting.user_name,
            category: posting.category,
            date_created: posting.date_created,
            content: posting.content,
            accepted_app: posting.accepted_app
        }
    }
}

module.exports = PostingsService