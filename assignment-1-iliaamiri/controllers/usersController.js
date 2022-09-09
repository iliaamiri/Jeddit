const postModel = require('../models/Post');
const voteModel = require('../models/Votes');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');
const Post = new postModel();
const Vote = new voteModel();
const User = new userModel();
const Comment = new commentModel();

class UsersController {

    listUserPosts(req, res, next) {
        const user = req.user; // Authenticated user

        const user_id = Number(req.params.user_id);

        const requestedUser = this.getRequestedUser(user_id);

        if (!this.getRequestedUser(user_id)) {
            return res.redirect('/error/404');
        }

        const allUserPosts = Post.getUserPosts(user_id);

        const decoratedPosts = [];

        allUserPosts.map(post => {
            let user_vote_value = 0;
            if (user) {
                let user_vote = Vote.getVotesForPost(post.id).filter(vote => vote.user_id === user.id)[0];
                if (user_vote !== undefined) {
                    user_vote_value = (user_vote.user_id === user.id) ? user_vote.value : 0;
                }
            }

            decoratedPosts.push({
                ...Post.decoratePost(post),
                user_vote: user_vote_value
            });
        })

        res.render('user/posts', {
            user: user,
            requestedUser: requestedUser,
            allUserPosts: decoratedPosts
        })
    }

    listUserComments(req, res, next) {
        const user = req.user; // Authenticated user

        const user_id = Number(req.params.user_id);

        const requestedUser = this.getRequestedUser(user_id);

        if (!this.getRequestedUser(user_id)) {
            return res.redirect('/error/404');
        }

        const allUserComments = Comment.getAllCommentsFromUser(user_id);

        res.render('user/comments', {
            user: user,
            getUserById: User.getUser,
            requestedUser: requestedUser,
            allUserComments: allUserComments
        })
    }

    showUserProfile(req, res, next) {
        const user = req.user; // Authenticated user

        const user_id = Number(req.params.user_id);

        const requestedUser = this.getRequestedUser(user_id);

        if (!requestedUser) {
            return res.redirect('/error/404');
        }

        res.render('user/others_profile', {
            user: user,
            requestedUser: requestedUser
        })
    }

    getRequestedUser(user_id) {
        if (user_id === undefined || isNaN(user_id)) {
            return false;
        }

        const requestedUser = User.getUser(user_id);

        if (requestedUser === undefined) {
            return false;
        }

        return requestedUser
    }
}

module.exports = UsersController;