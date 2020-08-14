const express = require('express')
const ThreadsService = require('./threads-service');

const threadsRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const { restart } = require('nodemon');

const bodyParser = express.json();

threadsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        
        ThreadsService.getAllThreads(knex)
            .then(threads => {
                const newThreads = threads.map(thread => {
                    return ThreadsService.serializeThread(thread);
                })

                res.status(200).json(newThreads);
            })
    })
    .post(bodyParser, (req, res,next) => {
        const knex = req.app.get('db');
        const { title, category, date_created, content } = req.body;
        const user_id = req.user.id;
        const newThread = {
            title,
            category,
            date_created,
            content,
            user_id
        }
        console.log(newThread);

        for(const [key, value] of Object.entries(newThread)) {
            if(value == null) {
                return res.status(404).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        ThreadsService.insertThread(knex, newThread)
            .then(thread => {
                // console.log(thread);
                res
                    .status(201)
                    .location(`/api/schedule/${thread.id}`)
                    .json(ThreadsService.serializeThread(newThread))
            })
    })

threadsRouter
    .route('/:thread_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knex = req.app.get('db');
        const { thread_id } = req.params;

        ThreadsService.getThreadById(knex, thread_id)
            .then(thread => {
                if(!thread) {
                    return res.status(404).json({
                        error: { message: `Thread does not exist`}
                    })
                }
                res.thread = thread;
                next();
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.status(200).json(ThreadsService.serializeThread(res.thread));
    })
    .delete(bodyParser, (req, res, next) => {
        const knex = req.app.get('db')

        ThreadsService.deleteThread(knex, req.params.thread_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(bodyParser, (req, res, next) => {
        const knex = req.app.get('db')
        const { title, user_id, category, date_created, content } = req.body;
        const { thread_id } = req.params;

        let updatedThread = {
            title,
            user_id,
            category,
            date_created,
            content
        }

        ThreadsService.updateThread(knex, thread_id, updatedThread)
            .then(() => {
                res.status(202).end();
            })
            .catch(next);
    })

threadsRouter
    .route('/category/:category_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        const { category_id } = req.params

        ThreadsService.getThreadsByCategoryId(knex, category_id)
            .then(threads => {
                const newThreads = threads.map(thread => {
                    return ThreadsService.serializeThread(thread);
                })

                res
                    .status(200)
                    .json(newThreads)
            })
    })

threadsRouter
    .route('/user/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        const { user_id } = req.params;

        ThreadsService.getThreadsByUserId(knex, user_id)
            .then(threads => {
                const newThreads = threads.map(thread => {
                    return ThreadsService.serializeThread(thread);
                })
                
                res
                    .status(200)
                    .json(newThreads)
            })
    })

module.exports = threadsRouter