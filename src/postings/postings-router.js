const express = require('express')
const PostingsService = require('./postings-service')
const { requireAuth } = require('../middleware/jwt-auth')

const postingsRouter = express.Router()
const jsonBodyParser = express.json()

postingsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        try {
            const allPostings = await PostingsService.getAllPostings(
                req.app.get('db')
            )
            res.status(200).json(allPostings.map(posting => {
                return PostingsService.serializePosting(posting)
            }))
        } catch (error) {
            next(error)
        }
    })
    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { title, content, category } = req.body
            const  user_id = req.user.id
            const newPosting = { title, content, user_id, category }
            console.log('posting', newPosting)
            const insertedPosting = await PostingsService.insertPosting(
                req.app.get('db'),
                newPosting
            )
            res.status(201).json(PostingsService.serializePosting(insertedPosting))
        } catch (error) {
            next(error)
        }
    })

postingsRouter
    .route('/:posting_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knex = req.app.get('db')
        const { posting_id } = req.params;

        PostingsService.getPostingById(knex, posting_id)
            .then(posting => {
                if (!posting) {
                    return res.status(404).json({
                        error: { message: `Posting does not exist` }
                    })
                }

                res.posting = posting
                next();
            })
            .catch(next)
                
    })
    .get((req, res, next) => {
        res.status(200).json(PostingsService.serializePosting(res.posting))
    })
    .delete(async (req, res, next) => {
        try {
            await PostingsService.deletePosting(
                req.app.get('db'),
                req.params.posting_id
            )
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    })
    .patch(jsonBodyParser, async (req, res, next) => {
        try {
            const { title, content } = req.body
            const updateData = { title, content }
            const updatedPosting = await PostingsService.updatePosting(
                req.app.get('db'),
                req.params.posting_id,
                updateData
            )
            res.status(202).json(PostingsService.serializePosting(updatedPosting))
        } catch (error) {
            next(error)
        }
    })

postingsRouter
    .route('/category/:category_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        const { category_id } = req.params

        PostingsService.getPostingsByCategory(knex, category_id)
            .then(postings => {

                res
                    .status(200)
                    .json(postings.map(posting => {
                        return PostingsService.serializePosting(posting)
                    }))
            })
    })

postingsRouter
    .route('/user/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        const { user_id } = req.params

        PostingsService.getPostingsByUser(knex, user_id)
            .then(postings => {

                res
                    .status(200)
                    .json(postings.map(posting => {
                        return PostingsService.serializePosting(posting)
                    }))
            })
    })

module.exports = postingsRouter