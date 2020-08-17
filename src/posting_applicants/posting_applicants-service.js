
const PostingApplicantsService = {
    getApplicationsByUser(db, user_id) {
        return db
            .select('*')
            .from('posting_applicants')
            .join('users', 'users.id', 'applicant_id')
            .select('posting_applicants.id AS application_id')
            .where('applicant_id', user_id)
    },
    getPostingApplicationById(db, id) {
        return db
            .select('*')
            .from('posting_applicants')
            .join('users', 'users.id', 'applicant_id')
            .select('posting_applicants.id AS application_id')
            .where('application_id', id)
    },
    getByPostingId(db, posting_id) {
        return db
            .select('*')
            .from('posting_applicants')
            .join('users', 'users.id', 'applicant_id')
            .select('posting_applicants.id AS application_id')
            .where({ posting_id })
    },
    insertPostingApplicant(db, newApplicant) {
        return db
            .insert(newApplicant)
            .into('posting_applicants')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deletePostingApplicant(db, id) {
        return db('posting_applicants')
            .where({ id })
            .delete()
    },
    serializeApplicationDetails(application) {
        return {
            id: application.application_id,
            content: application.content,
            posting_id: application.posting_id,
            user: {
                user_id: application.applicant_id,
                email: application.email,
                endorsements: application.endorsements
            }
        }
    },
    // serializeApplicantDetails(applicant) {

    // },
    hasApplicant(db, applicant_id, posting_id) {
        return db('posting_applicants')
            .where({ posting_id, applicant_id})
            .first()
            .then(applicant => !!applicant)
    }
}

module.exports = PostingApplicantsService;