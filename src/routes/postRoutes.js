const express = require("express");
const Controller = require('../controllers/postController.js');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const ModifyPostAuthMiddleware = require('../middleware/ModifyPostAuthMiddleware');
const postModel = require('../models/Post');


const postRoutes = express.Router();

const postController = new Controller();

const Post = new postModel();

postRoutes.get('/show/:id', AuthMiddleware(), (req, res, next) => {
    postController.view(req, res, next)
})

postRoutes.use(AuthMiddleware(true))

postRoutes.get('/new', (req, res, next) => {
    postController.new_form(req, res, next)
})

postRoutes.get('/create', (req, res, next) => {
    res.redirect('/posts/new');
})

postRoutes.post('/create', (req, res, next) => {
    postController.new(req, res, next);
})


postRoutes.post('/vote/:post_id', (req, res, next) => {
    postController.setVote(req, res, next);
})

postRoutes.all('/edit/:id', ModifyPostAuthMiddleware())
postRoutes.all('/delete/:id', ModifyPostAuthMiddleware())
postRoutes.all('/delete/:id/confirm', ModifyPostAuthMiddleware())

postRoutes.get('/edit/:id', (req, res, next) => {
    postController.editForm(req, res, next)
})

postRoutes.post('/edit/:id', (req, res, next) => {
    postController.editSubmit(req, res, next);
})

postRoutes.get('/delete/:id', (req, res, next) => {
    postController.deletePrompt(req, res, next);
})

postRoutes.get('/delete/:id/confirm', (req, res, next) => {
    postController.deleteConfirm(req, res, next);
})

module.exports = postRoutes;