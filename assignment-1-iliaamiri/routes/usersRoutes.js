const express = require("express");
const AuthMiddleware = require('../middleware/AuthMiddleware');
const Controller = require('../controllers/usersController.js');
const usersRoutes = express.Router();

const usersController = new Controller();

usersRoutes.use(AuthMiddleware());

usersRoutes.get('/:user_id/posts/list', (req, res, next) => {
    usersController.listUserPosts(req, res, next)
})

usersRoutes.get('/:user_id/comments/list', (req, res, next) => {
    usersController.listUserComments(req, res, next)
})

usersRoutes.get('/:user_id', (req, res, next) => {
    usersController.showUserProfile(req, res, next)
})

module.exports = usersRoutes