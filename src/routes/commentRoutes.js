const express = require("express");
const AuthMiddleware = require('../middleware/AuthMiddleware');
const ModifyCommentAuthMiddleware = require('../middleware/ModifyCommentAuthMiddleware');
const Controller = require('../controllers/commentController.js');

const commentRoutes = express.Router();

const commentController = new Controller();

commentRoutes.get('/show/:comment_id', AuthMiddleware(), (req, res, next) => {
    commentController.show(req, res, next);
})

commentRoutes.use(AuthMiddleware(true));

commentRoutes.post('/reply/:post_id/:parent_comment_id', (req, res, next) => {
    commentController.reply(req, res, next);
})

commentRoutes.all('/edit/:comment_id', ModifyCommentAuthMiddleware());
commentRoutes.all('/delete/:comment_id', ModifyCommentAuthMiddleware());

commentRoutes.post('/edit/:comment_id', (req, res, next) => {
    commentController.editSubmit(req, res, next);
})

commentRoutes.post('/delete/:comment_id', (req, res, next) => {
    commentController.deleteConfirm(req, res, next);
})


module.exports = commentRoutes;