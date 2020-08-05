const express = require('express');
const CategoriesService = require('./categories-service');

const categoriesRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');

const bodyParser = express.json();

categoriesRouter
    .route('/')
    .get((req, res, next) => {
        
    })