const express = require('express')
const PostingsService = require('./postings-service')
const { requireAuth } = require('../middleware/jwt-auth')

const postingsRouter = express.Router()
const jsonBodyParser = express.json()

postingsRouter
    .route('/')
    .get(async (req, res, next) => {
        try {
            const allPostings = await PostingsService.getAllPostings(
                req.app.get('db')
            )
            res.status(200).json(allPostings)
        } catch(error) {
            next(error)
        }
    })
    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { title, content, user_id, category_id } = req.body
            const newPosting = { title, content, user_id, category_id }
            const insertedPosting = await PostingsService.insertPosting(
                req.app.get('db'),
                newPosting
            )
            res.status(201).json(insertedPosting)
        } catch(error) {
            next(error)
        }
    })

postingsRouter
    .route('/:id')
    .delete(async (req, res, next) => {
        try {
            await PostingsService.deletePosting(
                req.app.get('db'),
                req.params.id 
            )
            res.status(204).end()
        } catch(error) {
            next(error)
        }
    })
    .patch(jsonBodyParser, async (req, res, next) => {
        try {
            const { title, content } = req.body
            const updateData = { title, content }
            const updatedPosting = await PostingsService.updatePosting(
                req.app.get('db'),
                req.params.id,
                updateData
            )
            res.status(202).json(updatedPosting)
        } catch(error) {
            next(error)
        }
    })

module.exports = postingsRouter