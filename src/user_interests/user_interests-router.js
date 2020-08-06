const express = require('express')
const UserInterestsService = require('./user_interests-service')
const { requireAuth } = require('../middleware/jwt-auth')

const interestsRouter = express.Router()
const jsonBodyParser = express.json()

interestsRouter
    .route('/')
    // .all(requireAuth)
    .get(async (req, res, next) => {
        try {
            const interests = await UserInterestsService.getUserInterests(
                req.app.get('db'),
                req.user.id
            )
            res.json({
                interests
            })
            next()
        } catch (error) {
            next(error)
        }
    })

module.exports = interestsRouter;