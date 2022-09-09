const postModel = require('../models/Post');
const subModel = require('../models/Sub');
const commentModel = require('../models/Comment');
const userModel = require('../models/User');
const voteModel = require('../models/Votes');
const Post = new postModel();
const Sub = new subModel();
const Comment = new commentModel();
const User = new userModel();
const Vote = new voteModel();

class PostController {

    view(req, res, next) {
        const user = req.user;
        try {

            const post_id = req.params.id;
            if (post_id === undefined) {
                return res.redirect("/error/404");
            }

            const post = Post.getPost(post_id);

            if (post === null) {
                return res.redirect("/error/404");
            }

            post.comments = post.comments
                .filter(comment => comment.parent_id === 0)
                .sort((comment1, comment2) => comment2.timestamp - comment1.timestamp);

            let user_vote_value = 0;
            if (user) {
                let user_vote = Vote.getVotesForPost(post.id).filter(vote => vote.user_id === user.id)[0];
                if (user_vote !== undefined) {
                    user_vote_value = (user_vote.user_id === user.id) ? user_vote.value : 0;
                }
            }

            post.user_vote = user_vote_value

            res.render('post/view', {
                user: user,
                post,
                getChildrenOfComment: Comment.getChildrenOfComment,
                getUserById: User.getUser
            })
        } catch (e) {
            console.log(e)
            res.redirect("/error/500");
        }
    }

    new_form(req, res, next) {
        res.render('post/new_form', {user: req.user, subs: Sub.getSubs()});
    }

    new(req, res, next) {
        try {
            const user = req.user;
            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const params = req.body;
            const givenLink = String(params.inputLink);
            const givenTitle = String(params.inputTitle);
            const givenDescription = String(params.textareaInputDescription);
            const givenSub = String(params.finalInputSub);

            // Todo: Use Regex for validations.
            if (givenLink === undefined || givenLink.length < 5) {
                throw "Invalid Link! A Link must have more than 4 characters.";
            }
            if (givenTitle === undefined || givenTitle.length < 1) {
                throw "Invalid Title! A Title must have at least one character.";
            }
            if (givenDescription === undefined || givenDescription.length < 3) {
                throw "Invalid Description! A Description must have at least 2 character.";
            }
            if (givenSub === undefined || givenSub.length < 1) {
                throw "Invalid Sub-group! A Sub-group must have at least one character.";
            }

            const createdPost = Post.addPost(givenTitle, givenLink, user.id, givenDescription, givenSub);

            return res.json({
                status: 1,
                post: createdPost,
                msg: "Post was created successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    editForm(req, res, next) {
        const allSubs = Sub.getSubs();

        res.render('post/edit_form', {
            user: req.user,
            post: req.modifyingPost,
            allSubs: allSubs
        })
    }

    editSubmit(req, res, next) {
        try {
            const user = req.user;
            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const currentPost = req.modifyingPost;

            const params = req.body;
            const givenLink = String(params.inputLink);
            const givenTitle = String(params.inputTitle);
            const givenDescription = String(params.textareaInputDescription);
            const givenSub = String(params.finalInputSub);

            // Todo: Use Regex for validations.
            if (givenLink === undefined || givenLink.length < 5) {
                throw "Invalid Link! A Link must have more than 4 characters.";
            }
            if (givenTitle === undefined || givenTitle.length < 1) {
                throw "Invalid Title! A Title must have at least one character.";
            }
            if (givenDescription === undefined || givenDescription.length < 3) {
                throw "Invalid Description! A Description must have at least 2 character.";
            }
            if (givenSub === undefined || givenSub.length < 1) {
                throw "Invalid Sub-group! A Sub-group must have at least one character.";
            }

            Post.editPost(currentPost.id, {
                title: givenTitle,
                link: givenLink,
                description: givenDescription,
                subgroup: givenSub
            });

            return res.json({
                status: 1,
                msg: "Post was updated successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    deletePrompt(req, res, next) {
        const user = req.user;
        try {

            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const currentPost = req.modifyingPost;

            res.render('post/deletePrompt', { user: user, post: currentPost });
        } catch (e) {
            res.redirect("/error/403");
        }
    }

    deleteConfirm(req, res, next) {
        const user = req.user;
        try {

            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const currentPost = req.modifyingPost;

            Post.deletePost(currentPost.id);

            const allSubs = Sub.getSubs();

            if (allSubs.includes(currentPost.subgroup)) {
                res.redirect('/subs/' + currentPost.subgroup);
            } else {
                res.redirect('/');
            }
        } catch (e) {
            res.redirect("/error/403");
        }
    }

    setVote(req, res, next) {
        const user = req.user;
        try {
            if (user === undefined) {
                throw "Authentication Failed"; // This should never happen in this scenario though.
            }

            const post_id = Number(req.params.post_id);

            const params = req.body;
            let newVoteValue = Number(params.new_vote_value);

            if (post_id === undefined || isNaN(post_id) || Post.getPost(post_id) === null) {
                throw "Invalid post! No such post exists";
            }

            const validVoteValues = [0, +1, -1];
            if (newVoteValue === undefined || isNaN(newVoteValue) || !validVoteValues.includes(newVoteValue)) {
                throw "Invalid vote! A vote must be either +1, 0, or -1";
            }

            const currentVote = Vote.getVote(user.id, post_id);

            if (currentVote === undefined) {
                Vote.recordVote(user.id, post_id, newVoteValue)
            } else {
                Vote.editVote(user.id, post_id, newVoteValue);
            }

            const newNetVote = Vote.getVotesForPost(post_id).reduce((net, vote) => net + vote.value, 0);

            return res.json({
                status: 1,
                updated_vote_value: newVoteValue,
                new_net_votes: newNetVote,
                msg: "Post was updated successfully."
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }
}

module.exports = PostController;