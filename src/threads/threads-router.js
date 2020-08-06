const express = require('express')
const ThreadsService = require('./threads-service');

const threadsRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const { restart } = require('nodemon');

const bodyParser = express.json();

threadsRouter
    .route('/')

threadsRouter
    .route('/category/:category_id')

threadsRouter
    .route('/user/:user_id')