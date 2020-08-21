const express = require('express')
const path= require('path')
const UserService = require('./user-service')
const { requireAuth } = require('../middleware/jwt-auth')

const userRouter = express.Router()
const jsonBodyParser = express.json()

userRouter
    .post('/', jsonBodyParser, async (req, res, next) => {
        const { user_name, password, email } = req.body

        for (const field of ['user_name', 'password', 'email']) {
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        }


        try {
            const passwordError = UserService.validatePassword(password)
            if(passwordError)
                return res.status(400).json({ error: passwordError })
            
            const emailError = UserService.validateEmail(email)
            if (emailError)
                return res.status(400).json({ error: emailError })
            
            const hasUserWithUserName = await UserService.hasUserWithUserName(
                req.app.get('db'),
                user_name
            )
            if (hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })

            const hasUserWithEmail = await UserService.hasUserWithEmail(
                req.app.get('db'),
                email
            )
            if (hasUserWithEmail)
                return res.status(400).json({ error: `Email already taken`})

            const hashedPassword = await UserService.hashPassword(password)

            const newUser = {
                user_name,
                password: hashedPassword,
                email
            }
            
            const user = await UserService.insertUser(
                req.app.get('db'),
                newUser
            )

            
            
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UserService.serializeUser(user))
        } catch(error) {
            next(error)
        }
    })

userRouter
    .route('/:user_name')
    .get((req, res, next) => {
        const knex = req.app.get('db')
        const { user_name } = req.params;
        console.log(user_name)

        UserService.getUserInfo(knex, user_name)
            .then(user => {
                console.log(user)
                res
                    .status(200)
                    .json(UserService.serializeUser(user))
            })
    })

userRouter
    .route('/:id')
    .all(requireAuth)
    .patch(jsonBodyParser, (req, res, next) => {
        const knex = req.app.get('db')
        const { profile_pic, intro, endorsements, email } = req.body;
        const id = req.params.id;

        let updatedUser = {
            profile_pic,
            intro,
            endorsements,
            email
        }

        console.log(updatedUser);

        UserService.updateUserInfoById(knex, id, updatedUser)
            .then(user => {
                res.status(202).json(UserService.serializeUser(user));
            })
            .catch(next);

    })

module.exports = userRouter