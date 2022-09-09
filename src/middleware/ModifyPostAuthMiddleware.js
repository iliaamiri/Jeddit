const postModel = require('../models/Post');
const Post = new postModel();

module.exports = () => (req, res, next) => {
    const post_id = req.params.id;
    const user = req.user;

    if (post_id === undefined) {
        return res.redirect('/error/403');
    }

    const post = Post.getPost(post_id);

    if (user.id !== post.creator.id) {
        return res.redirect('/error/403');
    }

    req.modifyingPost = post;

    next();
}