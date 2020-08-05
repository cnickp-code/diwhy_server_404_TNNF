const express = require('express');
const CategoriesService = require('./categories-service');

const categoriesRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const { restart } = require('nodemon');

const bodyParser = express.json();

categoriesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');

        CategoriesService.getAllCategories(knexInstance)
            .then(categories => {
                const serializedCategories = categories.map(category => {
                    return CategoriesService.serializeCategoryItem(category);
                })

                res.status(200).json(serializedCategories);
            })
    })

categoriesRouter
    .route('/:category_id')
    .get((req, res, next) => {
        let knexInstance = req.app.get('db');

        CategoriesService.getCategoryById(knexInstance, req.params.category_id)
            .then(category => {
                if(!category) {
                    return res.status(404).json({
                        error: { message: 'Date item does not exist.' }
                    })
                }
                res.category = category;
            })
        
        res.status(200).json(CategoriesService.serializeCategoryItem(res.category));
    })