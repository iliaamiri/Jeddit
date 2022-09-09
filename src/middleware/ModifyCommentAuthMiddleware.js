const commentModel = require('../models/Comment');
const postModel = require('../models/Post');
const Comment = new commentModel();
const Post = new postModel();

module.exports = () => (req, res, next) => {
    let comment_id = req.params.comment_id;

    const user = req.user;

    if (comment_id === undefined || isNaN(Number(comment_id))) {
        return res.redirect('/error/500');
    }

    const comment = Comment.getComment(comment_id);


    if (comment === null) {
        return res.redirect('/error/404');
    }

    if (comment.creator !== user.id) {
        return res.redirect('/error/403');
    }

    const post = Post.getPost(comment.post_id);

    if (post === null) {
        return res.redirect('/error/404');
    }

    req.post = post;
    req.comment = comment;

    next();
}