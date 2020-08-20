const express = require('express')
const LikesService = require('./likes-service')
const { requireAuth } = require('../middleware/jwt-auth');
const { json } = require('express');
const { route } = require('../user/user-router');

const likesRouter = express.Router();
const jsonBodyParser = express.json();

likesRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db')
        const { thread_id } = req.body;
        const user_id = req.user.id;

        const newLike = {
            user_id,
            thread_id
        }

        LikesService.insertLikes(knex, newLike)
            .then(like => {
                res
                    .status(201)
                    .location(`/api/likes/${like.id}`)
                    .json(like)
            })
    })

likesRouter
    .route('/thread/:thread_id')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const knex = req.app.get('db')
        const { thread_id } = req.params;

        LikesService.getLikesByThreadId(knex, thread_id)
            .then(likes => {
                res
                    .status(200)
                    .json(likes)
            })
    })
    .delete(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db');
        const { thread_id } = req.body;
        const { user_id } = req.user.id;

        LikesService.deleteLike(knex, user_id, thread_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })

module.exports = likesRouter