const express = require('express')
const PostingApplicantsService = require('./posting_applicants-service')
const { requireAuth } = require('../middleware/jwt-auth')

const postingApplicantsRouter = express.Router()
const jsonBodyParser = express.json()

postingApplicantsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        try {
            // need to decided what applicants we want to get
        } catch(error) {
            next(error)
        }
    })

    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { posting_id, applicant_id } = req.body
            const newPostingApplicant = { posting_id, applicant_id }

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

module.exports = postingApplicantsRouter