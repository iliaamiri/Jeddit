const Model = require('../core/model');

const posts = require("../core/fakeDB/data/posts");
const users = require("../core/fakeDB/data/users");
const comments = require("../core/fakeDB/data/comments");

const VoteModel = require("./Votes");
const Vote = new VoteModel();

class Post extends Model {

    decoratePost(post) {
        post = {
            ...post,
            creator: users[post.creator],
            votes: Vote.getVotesForPost(post.id),
            comments: Object.values(comments).filter(comment => comment.post_id === post.id).map(comment => ({ ...comment, creator: users[comment.creator] })),
        }
        return post;
    }

    /**
     * @param {*} n how many posts to get, defaults to 5
     * @param {*} sub which sub to fetch, defaults to all subs
     */
    getPosts(n = 5, sub = undefined) {
        let allPosts = Object.values(posts);
        if (sub) {
            allPosts = allPosts.filter(post => post.subgroup === sub);
        }
        allPosts.sort((a, b) => b.timestamp - a.timestamp);
        return allPosts.slice(0, n);
    }

    getPost(id) {
        if (posts[id] !== undefined) {
            return this.decoratePost(posts[id]);
        } else {
            return null;
        }
    }

    getUserPosts(user_id) {
        let allPosts = Object.values(posts);

        allPosts = allPosts
            .filter(post => post.creator === user_id)
            .sort((a, b) => b.timestamp - a.timestamp);

        return allPosts;
    }

    addPost(title, link, creator, description, subgroup) {
        let id = Math.max(...Object.keys(posts).map(Number)) + 1;
        let post = {
            id,
            title,
            link,
            description,
            creator: Number(creator),
            subgroup,
            timestamp: Date.now(),
        }
        posts[id] = post;
        return post;
    }

    editPost(post_id, changes = {}) {
        let post = posts[post_id];

        if (changes.title) {
            post.title = changes.title;
        }
        if (changes.link) {
            post.link = changes.link;
        }
        if (changes.description) {
            post.description = changes.description;
        }
        if (changes.subgroup) {
            post.subgroup = changes.subgroup;
        }
    }

    deletePost(post_id) {
        delete posts[post_id];
    }
}

module.exports = Post;