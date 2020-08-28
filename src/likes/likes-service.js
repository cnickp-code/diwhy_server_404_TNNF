const LikesService = {
    getLikesByThreadId(db, thread_id) {
        return db
            .select('*')
            .from('likes')
            .where({ thread_id });
    },
    insertLikes(db, newLike) {
        return db
            .insert(newLike)
            .into('likes')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deleteLike(db, user_id, thread_id) {
        return db
            .from('likes')
            .where({
                user_id,
                thread_id
            })
            .delete();
    }
};

module.exports = LikesService