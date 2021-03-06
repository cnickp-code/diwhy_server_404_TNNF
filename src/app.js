require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const userRouter = require('./user/user-router');
const authRouter = require('./auth/auth-router');
const interestsRouter = require('./user_interests/user_interests-router');
const categoriesRouter = require('./categories/categories-router');
const threadsRouter = require('./threads/threads-router');
const commentsRouter = require('./comments/comments-router');
const postingsRouter = require('./postings/postings-router');
const likesRouter = require('./likes/likes-router');
const commentLikesRouter = require('./comment_likes/comment_likes-router');
const postingApplicantsRouter = require('./posting_applicants/posting_applicants-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/interests', interestsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/threads', threadsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/postings', postingsRouter)
app.use('/api/applicants', postingApplicantsRouter)
app.use('/api/likes', likesRouter)
app.use('/api/comment_likes', commentLikesRouter)


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app