const CommentsService = {
    getCommentsByThread(db, thread_id) {
        return db
            .select('*')
            .from('comments')
            .where({ thread_id })
            .orderBy('date_created')
    },
    getCommentById(db, id) {
        return db
            .select('*')
            .from('comments')
            .where({ id })
            .orderBy('date_created')
    },
    getAllComments(db) {
        return db
            .from('comments')
            .orderBy('date_created')
    },
    deleteComment(db, id) {
        return db('comments')
            .where({ id })
            .delete()
    },
    insertComment(db, newComment) {
        return db
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateComment(db, id, data) {
        return db('comments')
            .where({ id })
            .update(data)
    }
}

module.exports = CommentsService