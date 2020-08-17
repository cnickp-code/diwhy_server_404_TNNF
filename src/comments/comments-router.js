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

            res.status(201).json(CommentsService.serializeComment(insertComment))
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/thread/:thread') 
    .all(requireAuth)
    .get(async (req, res, next) => {
        try {
            const threadComments = await CommentsService.getCommentsByThread(
                req.app.get('db'),
                req.params.thread
            )

            let newComments = threadComments.map(comment => {
                console.log(comment);
                return CommentsService.serializeComment(comment);
            })
            console.log(newComments)

            res.status(200).json(newComments)
        } catch(error) {
            next(error)
        }
    })

commentsRouter
    .route('/:comment_id') // TALK ABOUT CHANGING THIS
    .all(requireAuth)
    .all((req, res, next) => {
        const knex = req.app.get('db')
        const { comment_id } = req.params;

        CommentsService.getCommentById(knex, comment_id)
            .then(comment => {
                if(!comment) {
                    return res.status(404).json({
                        error: { message: `Comment does not exist` }
                    })
                }
                res.comment = comment;
                next();
            })
            .catch(next)
    })
    .get((req, res, next) => {
        console.log(res.comment)
        res.status(200).json(CommentsService.serializeComment(res.comment));
    })
    .delete(async (req, res, next) => {
        try {
            await CommentsService.deleteComment(
                req.app.get('db'),
                req.params.comment_id
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
                req.params.comment_id,
                { content: content }
            )
            const updatedComments = await CommentsService.getCommentById(
                req.app.get('db'),
                req.params.comment_id
            )
            console.log(updatedComments)
            res.status(202).json(CommentsService.serializeComment(updatedComments))
        } catch(error) {
            next(error)
        }
    })

module.exports = commentsRouter