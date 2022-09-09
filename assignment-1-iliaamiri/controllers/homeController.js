const postModel = require('../models/Post');
const userModel = require('../models/User');
const voteModel = require('../models/Votes');
const Post = new postModel();
const User = new userModel();
const Vote = new voteModel();

class HomeController {
    index(req, res, next) {
        const user = req.user;

        const postOrder = req.query.post_orders;

        const twentyMostRecentPosts = Post.getPosts(20);

        const decoratedPosts = [];

        twentyMostRecentPosts.map(post => {
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

        const availableOrders = ["most_controversial", "oldest"];
        if (postOrder !== undefined && availableOrders.includes(postOrder)) {
            switch (postOrder) {
                case "most_controversial":
                    decoratedPosts.sort((post1, post2) => post2.votes.length - post1.votes.length);
                    break;
                case "oldest":
                    decoratedPosts.sort((post1, post2) => post1.timestamp - post2.timestamp);
                    break;
            }
        }

        res.render('home', {
            user: user,
            posts: decoratedPosts
        })
    }
}

module.exports = HomeController;