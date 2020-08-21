const CommentLikesService = {
    getLikesByCommentId(db, comment_id) {
        return db
            .select('*')
            .from('comment_likes')
            .where({ comment_id })
    },
    insertCommentLikes(db, newLike) {
        return db
            .insert(newLike)
            .into('comment_likes')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deleteCommentLike(db, user_id, comment_id) {
        return db
            .from('comment_likes')
            .where({
                user_id,
                comment_id
            })
            .delete()
    }
}

module.exports = CommentLikesService;