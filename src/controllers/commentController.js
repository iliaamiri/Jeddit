const commentModel = require('../models/Comment');
const userModel = require('../models/User');
const postModel = require('../models/Post');
const Comment = new commentModel();
const User = new userModel();
const Post = new postModel();

class CommentController {
    show(req, res, next) {
        const user = req.user;
        try {
            const comment_id = req.params.comment_id;
            if (comment_id === undefined) {
                throw "COMMENT_NOT_FOUND";
            }

            const comment = Comment.getComment(comment_id);

            if (comment === null) {
                throw "COMMENT_NOT_EXIST";
            }

            let parentComment;
            if (comment.parent_id === 0) {
                parentComment = null;
            } else {
                parentComment = Comment.getComment(comment.parent_id)
            }

            const post = Post.getPost(comment.post_id);

            res.render('comment/view', {
                user: user,
                comment: comment,
                post: post,
                parentComment: parentComment,
                getChildrenOfComment: Comment.getChildrenOfComment,
                getUserById: User.getUser
            })
        } catch (e) {
            res.redirect("/error/404");
        }
    }

    reply(req, res, next) {
        try {
            const parent_id = req.params.parent_comment_id;
            const post_id = req.params.post_id;

            const user = req.user;
            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const params = req.body;
            const givenReplyMessage = String(params.messageValue);

            // Todo: Use Regex for validations.
            if (post_id === undefined || post_id.length < 1 || isNaN(Number(post_id)) ||
                parent_id === undefined || parent_id.length < 1 || isNaN(Number(parent_id))) {
                throw "Something went wrong";
            }
            if (givenReplyMessage === undefined || givenReplyMessage.length < 2) {
                throw "Invalid reply message! A message must have at least two characters.";
            }

            const createdComment = Comment.addComment(post_id, user.id, givenReplyMessage, parent_id);

            return res.json({
                status: 1,
                comment: createdComment,
                msg: "Comment was created successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    editSubmit(req, res, next) {
        try {
            const comment = req.comment;

            const params = req.body;
            const givenMessage = String(params.messageValue);

            // Todo: Use Regex for validations.
            if (givenMessage === undefined || givenMessage.length < 2) {
                throw "Invalid message! A message must have more than 1 characters.";
            }

            const updatedComment = Comment.editComment(comment.id, {
                message: givenMessage
            });

            return res.json({
                status: 1,
                comment: updatedComment,
                msg: "Comment was updated successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    deleteConfirm(req, res, next) {
        try {
            const comment = req.comment;

            Comment.deleteComment(comment.id);

            return res.json({
                status: 1,
                msg: "Comment was deleted successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }
}

module.exports = CommentController;