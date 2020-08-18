const express = require('express')
const PostingApplicantsService = require('./posting_applicants-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { serializeApplicationDetails } = require('./posting_applicants-service')
const { application } = require('express')

const postingApplicantsRouter = express.Router()
const jsonBodyParser = express.json()

postingApplicantsRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { posting_id, content, applicant_id } = req.body
            const newPostingApplicant = { posting_id, content, applicant_id }

            const postedApplicant = await PostingApplicantsService.insertPostingApplicant(
                req.app.get('db'),
                newPostingApplicant
            )

            res.status(201).json(postedApplicant)
        } catch(error) {
            next(error)
        }
    })

postingApplicantsRouter
    .route('/:id')
    .all(requireAuth)
    .delete(async (req, res, next) => {
        try {
            await PostingApplicantsService.deletePostingApplicant(
                req.app.get('db'),
                req.params.id 
            )

            res.status(204).end()
        } catch(error) {
            next(error)
        }
    })


postingApplicantsRouter
    .route('/postings/:posting_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const { posting_id } = req.params

        PostingApplicantsService.getByPostingId(db, posting_id)
            .then(applications => {
                if(!applications){
                    return res.status(404).send('no current applications')
                }
                const newApplications = applications.map(application => {
                    return PostingApplicantsService.serializeApplicationDetails(application)
                })
                res.status(200).json(newApplications)
            })
            .catch(err => next(err));
    })

postingApplicantsRouter
    .route('/user/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const db = req.app.get('db')
        const { user_id } = req.params

        PostingApplicantsService.getApplicationsByUser(db, user_id) 
            .then(applications => {
                if(!applications){
                    return res.status(404).send('you have no active applications')
                }
                const userApplications = applications.map(application => {
                    return PostingApplicantsService.serializeApplicationDetails(application)
                })
                res.status(200).json(userApplications)
            })
            .catch(err => next(err));
    })

module.exports = postingApplicantsRouter