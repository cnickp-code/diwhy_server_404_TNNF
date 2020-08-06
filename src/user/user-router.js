const express = require('express')
const path= require('path')
const UserService = require('./user-service')

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
            console.log(UserService.serializeUser(user))
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UserService.serializeUser(user))
        } catch(error) {
            next(error)
        }
    })

module.exports = userRouter