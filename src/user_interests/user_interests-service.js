const UserInterestsService = {
    getUserInterests(db, user_id) {
        return db
            .select('*')
            .from('users_interests')
            .where({ user_id })
            .orderBy('id')
    }
}

module.exports = UserInterestsService;