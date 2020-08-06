const UserInterestsService = {
    getUserInterests(db, user_id) {
        return db
            .select('*')
            .from('users_interests')
            .where({ user_id })
            .orderBy('id')
    },
    getUserInterestById(db, id) {
        return db
            .select('*')
            .from('users_interests')
            .where({ id })
    },
    insertUserInterest(db, newInterest) {
        return db
            .insert(newInterest)
            .into('users_interests')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUserInterest(db, id) {
        return db('users_interests')
            .where({ id })
            .delete()
    }
}

module.exports = UserInterestsService;