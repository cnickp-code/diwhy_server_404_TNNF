const express = require('express')
const PostingsService = require('./postings-service')
const { requireAuth } = require('../middleware/jwt-auth')

const postingsRouter = express.Router()
const jsonBodyParser = express.json()

postingsRouter
    .route('/')


module.exports = postingsRouter