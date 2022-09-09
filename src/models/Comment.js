const Model = require('../core/model');
const comments = require('../core/fakeDB/data/comments');
const posts = require("../core/fakeDB/data/posts");

class Comment extends Model {
    addComment(post_id, creator, description, parent_id) {
        let id = Math.max(...Object.keys(comments).map(Number)) + 1;
        let comment = {
            id,
            post_id: Number(post_id),
            parent_id: Number(parent_id),
            creator: Number(creator),
            description,
            timestamp: Date.now(),
        }
        comments[id] = comment;
        return comment;
    }

    getComment(comment_id) {
        const result = comments[comment_id];
        return (result !== undefined) ? result : null;
    }

    getChildrenOfComment(comment_id) {
        return Object.values(comments).reduce((result, comment) => {
            if (comment.parent_id === comment_id) {
                result.push(comment);
            }
            return result;
        }, []).sort((comment1, comment2) => comment2.timestamp - comment1.timestamp);
    }

    getAllCommentsFromUser(user_id) {
        return Object.values(comments).reduce((result, comment) => {
            if (comment.creator === Number(user_id)) {
                result.push(comment);
            }
            return result;
        }, []).sort((comment1, comment2) => comment2.timestamp - comment1.timestamp);
    }

    getJoinedChildrenToParent() {
        const result = {};

        Object.values(comments).map(comment => {
            if (comment.parent_id === 0) {
                result[comment.id] = {
                    ...comment,
                    children: {}
                };
            } else {
                if (result[comment.parent_id]['children'] === undefined) {
                    result[comment.parent_id].children = {};
                }
                result[comment.parent_id].children[comment.id] = comment;
            }
        });

        return result;
    }

    editComment(comment_id, changes = {}) {
        let comment = comments[comment_id];

        if (changes.message) {
            comment.description = changes.message;
        }
        return comment;
    }

    deleteComment(comment_id) {
        delete comments[comment_id];
    }
}

module.exports = Comment;