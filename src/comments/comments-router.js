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

            res.status(201).json(insertComment)
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/thread/:thread') 
    .get(async (req, res, next) => {
        try {
            console.log('thread id', req.params.thread)
            const threadComments = await CommentsService.getCommentsByThread(
                req.app.get('db'),
                req.params.thread
            )
            console.log('comment', threadComments)
            res.status(200).json(threadComments)
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/:id') // TALK ABOUT CHANGING THIS
    .delete(async (req, res, next) => {
        try {
            await CommentsService.deleteComment(
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
            const { content } = req.body
            await CommentsService.updateComment(
                req.app.get('db'),
                req.params.id,
                { content: content }
            )
            const updatedComments = await CommentsService.getCommentById(
                req.app.get('db'),
                req.params.id
            )
            console.log(updatedComments)
            res.status(202).json(updatedComments)
        } catch(error) {
            next(error)
        }
    })

module.exports = commentsRouter