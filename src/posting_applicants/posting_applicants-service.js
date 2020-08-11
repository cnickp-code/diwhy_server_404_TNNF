
const PostingApplicantsService = {
    getApplicantByUser(db, applicant_id) {
        return db
            .select('*')
            .from('posting_applicants')
            .where({ applicant_id })
    },
    getPostingApplicantById(db, id) {
        return db
            .select('*')
            .from('posting_applicants')
            .where({ id })
    },
    getByPostingId(db, posting_id) {
        return db
            .select('*')
            .from('posting_applicants')
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
    serializeApplicant(applicant) {

    },
    serializeApplicantDetails(applicant) {

    },
    hasApplicant(db, applicant_id, posting_id) {
        return db('posting_applicants')
            .where({ posting_id, applicant_id})
            .first()
            .then(applicant => !!applicant)
    }
}

module.exports = PostingApplicantsService;