const express = require('express');
const CommentLikesService = require('./comment_likes-service');
const { requireAuth } = require('../middleware/jwt-auth');

const commentLikesRouter = express.Router();
const jsonBodyParser = express.json();

commentLikesRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { comment_id } = req.body;
        const user_id = req.user.id;

        const newLike = {
            user_id,
            comment_id
        };

        CommentLikesService.insertCommentLikes(knex, newLike)
            .then(like => {
                res
                    .status(201)
                    .location(`/api/comment_likes/${like.id}`)
                    .json(like);
            });
    });

commentLikesRouter
    .route('/comment/:comment_id')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const knex = req.app.get('db');
        const { comment_id } = req.params;

        CommentLikesService.getLikesByCommentId(knex, comment_id)
            .then(likes => {
                res
                    .status(200)
                    .json(likes);
            });
    })
    .delete(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { comment_id } = req.params;
        const user_id = req.user.id;

        CommentLikesService.deleteCommentLike(knex, user_id, comment_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = commentLikesRouter