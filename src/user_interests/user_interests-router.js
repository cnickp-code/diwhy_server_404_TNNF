const express = require('express')
const UserInterestsService = require('./user_interests-service')
const { requireAuth } = require('../middleware/jwt-auth')

const interestsRouter = express.Router()
const jsonBodyParser = express.json()

interestsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        try {
            UserInterestsService.getUserInterests(req.app.get('db'), req.user.id)
                .then(interests => {
                    const newInterests = interests.map(interest => {
                        return UserInterestsService.serializeInterestDetails(interest);
                    })
                    res.status(200).json(newInterests);
                })
                
        } catch (error) {
            next(error)
        }
    })

    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const { user_id, category_id } = req.body
            const newInterest = { user_id, category_id }

            const insertInterest = await UserInterestsService.insertUserInterest(
                req.app.get('db'),
                newInterest
            )

            const interestById = await UserInterestsService.getUserInterestById(
                req.app.get('db'),
                insertInterest.id
            )
            res.send({
                interestById
            })
        } catch (error) {
            next(error)
        }
    })

interestsRouter
    .route('/:id')
    .delete(async (req, res, next) => {
        try {
            await UserInterestsService.deleteUserInterest(
                req.app.get('db'),
                req.params.id
            )
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    })

module.exports = interestsRouter;