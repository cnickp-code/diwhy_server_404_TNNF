const express = require('express')
const UserInterestsService = require('./user_interests-service')
const { requireAuth } = require('../middleware/jwt-auth')

const interestsRouter = express.Router()
const jsonBodyParser = express.json()

interestsRouter
    .route('/')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const { user_name } = req.body;
        try {
            UserInterestsService.getUserInterests(req.app.get('db'), user_name)
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

            const hasInterest = await UserInterestsService.hasInterest(
                req.app.get('db'),
                user_id,
                category_id
            )

            if (hasInterest) {
                return res.status(400).json({ error: 'User interest already exists' })
            }

            const insertInterest = await UserInterestsService.insertUserInterest(
                req.app.get('db'),
                newInterest
            )

            const interestById = await UserInterestsService.getUserInterestById(
                req.app.get('db'),
                insertInterest.id
            )

            res.status(200).send(
                interestById
            )
        } catch (error) {
            next(error)
        }
    })

interestsRouter
    .route('/:id')
    .delete(async (req, res, next) => {
        try {
            const interestById = await UserInterestsService.getUserInterestById(
                req.app.get('db'),
                6
            )
            
            if (interestById === []) {
                return res.status(404).json({ error: 'User interest doesnt exist'})
            }

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