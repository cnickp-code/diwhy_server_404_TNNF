const express = require('express')
const CommentsService = require('./comments-service')
const { requireAuth } = require('../middleware/jwt-auth')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

commentsRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { content, thread_id, user_id } = req.body
            const newComment = { content, thread_id, user_id }

            const insertComment = await CommentsService.insertComment(
                req.app.get('db'),
                newComment
            )

            res.status(200).json(insertComment)
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/:thread')
    .get(async (req, res, next) => {
        try {
            const threadComments = await CommentsService.getCommentsByThread(
                req.app.get('db'),
                req.params.thread
            )

            res.json(threadComments)
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/:id')
    .delete(async (req, res, next) => {
        try {

        } catch(error) {
            next(error)
        }
    })

module.exports = commentsRouter