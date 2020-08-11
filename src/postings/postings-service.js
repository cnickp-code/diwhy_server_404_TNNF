const PostingsService = {
    getAllPostings(db) {
        return db
            .select('*')
            .from('postings')
            .orderBy('date_created')
    },
    getPostingsByCategory(db, category_id) {
        return db
            .from('postings')
            .where({ category_id })
            .orderBy('date_created')
    },
    getPostingsByUser(db, user_id) {
        return db
            .from('postings')
            .where({ user_id })
            .orderBy('date_created')
    },
    getPostingById(db, id) {
        return db
            .from('postings')
            .where({ id })
            .orderBy('date_created')
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
    }
}

module.exports = PostingsService