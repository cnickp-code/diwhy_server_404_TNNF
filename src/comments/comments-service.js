const CommentsService = {
    getCommentsByThread(db, thread_id) {
        return db
            .select('*')
            .from('comments')
            .join('users', 'users.id', 'user_id')
            // .select('users.id AS userId')
            .select('comments.id AS comment_id')
            .select('users.date_created AS user_created')
            .where({ thread_id })
            .orderBy('comment_id');
    },
    getCommentById(db, id) {
        return db
            .select('*')
            .from('comments')
            .join('users', 'users.id', 'user_id')
            .select('comments.id AS comment_id')
            .select('users.date_created AS user_created')
            .where('comments.id', id)
            .first();
    },
    getCommentByUser(db, user_id) {
        return db
            .select('*')
            .from('comments')
            .join('users', 'users.id', 'user_id')
            .select('comments.id AS comment_id')
            .select('users.date_created AS user_created')
            .where({ user_id })
            .orderBy('comment_id');
    },
    getAllComments(db) {
        return db
            .from('comments')
            .orderBy('id');
    },
    deleteComment(db, id) {
        return db('comments')
            .where({ id })
            .delete();
    },
    insertComment(db, newComment) {
        return db
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    updateComment(db, id, data) {
        return db('comments')
            .where({ id })
            .update(data);
    },
    serializeComment(comment) {
        return {
            id: comment.comment_id,
            content: comment.content,
            user_id: comment.user_id,
            thread_id: comment.thread_id,
            user_name: comment.user_name,
            user_pic: comment.profile_pic,
            date_created: comment.date_created
        };
    }
};

module.exports = CommentsService