
const UserInterestsService = {
    getUserInterests(db, user_name) {
        return db
            .from('users_interests')
            .join('categories', 'categories.id', 'category_id')
            .join('users', 'users.id', 'user_id')
            .select('*')
            .select(
                db.raw(
                    '"users_interests"."id" AS "interests_id"'
                )
            )
            .where({ user_name })
            // .orderBy('id')
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
    },
    serializeInterests(interest) {
        return {
            id: interest.id,
            user_id: interest.user_id,
            category_id: interest.category_id
        }
    },
    serializeInterestDetails(interest) {
        return {
            id: interest.id,
            user_id: interest.user_id,
            category_id: interest.category_id,
            category: interest.name
        }
    },
    hasInterest(db, user_id, category_id) {
        return db('users_interests')
            .where({ user_id, category_id })
            .first()
            .then(interest => !!interest)
    }
}

module.exports = UserInterestsService;