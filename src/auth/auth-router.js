const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { updateUser } = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .route('/token')
    .post(jsonBodyParser, async (req, res, next) => {
        // fields depend on how we setup login
        const { email, password } = req.body
        const loginUser = { email, password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        try {
            const dbUser = await AuthService.getUserWithEmail(
                req.app.get('db'),
                loginUser.email
            )
            if (!dbUser)
                return res.status(400).json({
                    error: 'Incorrect email or password'
                })

            const compareMatch = await AuthService.comparePasswords(
                loginUser.password,
                dbUser.password
            )
            if (!compareMatch) 
                return res.status(400).json({
                    error: 'Incorrect email or password'
                })

            const sub = dbUser.user_name
            const payload = {
                userId: dbUser.id,
                email: dbUser.email,
                user_name: dbUser.user_name
            }
            
            res.send({
                authToken: AuthService.createJwt(sub, payload)
            })
        } catch (error) {
            next(error)
        }
    })

    .put(requireAuth, (req, res) => {
        const sub = req.user.user_name
        const payload = {
            userId: req.user.id,
            email: dbUser.email,
            username: req.user.user_name
        }

        res.sendStatus({
            authToken: AuthService.createJwt(sub, payload)
        })
    })

    .patch(requireAuth, async (req, res, next) => {
        try {
            const { email, name, user_name } = req.body
            const currUser = { email, name, user_name}
            const dbUser = await AuthService.getUserWithEmail(
                req.app.get('db'),
                currUser.email
            )
            
            await AuthService.updateUser(
                req.app.get('db'),
                dbUser.id,
                {
                    email: email,
                    name: name,
                    user_name: user_name
                }
                )
            
            const updatedUser = await AuthService.getUserWithEmail(
                req.app.get('db'),
                currUser.email
            )
            res.send({
                email: updatedUser.email,
                name: updatedUser.name,
                user_name: updatedUser.user_name
            })
        } catch(error) {
            next(error)
        }
    })

module.exports = authRouter