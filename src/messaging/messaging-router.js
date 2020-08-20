const express = require('express')
const MessagingService = require('./messaging-service')
const { requireAuth } = require('../middleware/jwt-auth');
const { json } = require('express');

const messagingRouter = express.Router();
const jsonBodyParser = express.json();

messagingRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const knex = req.app.get('db')

        MessagingService.getAllMessages(knex)
            .then(messages => {
                const newMessages = messages.map(msg => {
                    return MessagingService.serializeMessage(msg);
                })

                res.status(200).json(newMessages)
            })
    })
    .post(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db')
        const { content } = req.body;
        const user_id = req.user.id;

        const newMsg = {
            content,
            user_id
        }

        for(const [key, value] of Object.entries(newMsg)) {
            if(value == null) {
                return res.status(404).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        MessagingService.insertMessage(knex, newMsg)
            .then(msg => {
                res
                    .status(201)
                    .location(`/api/messages/${msg.id}`)
                    .json(MessagingService.serializeMessage(msg))
            })
    })

messagingRouter
    .route('/:message_id')
    .all(requireAuth)
    .delete(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db')

        MessagingService.deleteMessage(knex, req.params.message_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next)
    })

messagingRouter
    .route('/user/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db')
        const { user_id } = req.params;

        MessagingService.getMessagesByUserId(knex, user_id)
            .then(messages => {
                const newMessages = messages.map(msg => {
                    return MessagingService.serializeMessage(msg)
                })

                res
                    .status(200)
                    .json(newMessages)
            })
    })

    module.exports = messagingRouter
