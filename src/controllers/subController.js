const postModel = require('../models/Post');
const subModel = require('../models/Sub');
const userModel = require('../models/User');
const voteModel = require('../models/Votes');
const Post = new postModel();
const Sub = new subModel();
const User = new userModel();
const Vote = new voteModel();

class SubController {

    list(req, res, next) {
        try {
            const allSubsUnordered = Sub.getSubsWithNumberOfPosts();

            const allSubsOrdered = Object.keys(allSubsUnordered).sort().reduce(
                (obj, key) => {
                    obj[key] = allSubsUnordered[key];
                    return obj;
                },
                {}
            );

            res.render('sub/index', {
                user: req.user,
                allSubs: allSubsOrdered
            })
        } catch (e) {
            res.redirect("/error/500");
        }
    }

    view(req, res, next) {
        try {
            const user = req.user;

            const sub_name = req.params.subname;

            const postOrder = req.query.post_orders;

            if (sub_name === undefined) {
                throw "SUB_NOT_FOUND";
            }

            let postsOfSub = Post.getPosts(20, sub_name)

            if (!postsOfSub) {
                throw "POSTS_NOT_EXIST";
            }

            const decoratedPosts = [];

            postsOfSub.map(post => {
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

            res.render('sub/view', {
                user: user,
                sub_name: sub_name,
                postsOfSub: decoratedPosts
            })
        } catch (e) {
            console.log(e)
            res.redirect("/error/404");
        }
    }
}

module.exports = SubController;