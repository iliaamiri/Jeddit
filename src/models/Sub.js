const Model = require('../core/model');
const posts = require('../core/fakeDB/data/posts');

class Sub extends Model {
    getSubs() {
        return Array.from(new Set(Object.values(posts).map(post => post.subgroup)))
    }

    getSubsWithNumberOfPosts() {
        const subsWithNumberOfPosts = {};

        Object.values(posts).map(post => {
            if (subsWithNumberOfPosts[post.subgroup] === undefined) {
                subsWithNumberOfPosts[post.subgroup] = {
                    sub_name: post.subgroup,
                    number_of_posts: 1
                };
            } else {
                subsWithNumberOfPosts[post.subgroup].number_of_posts++;
            }
        })

        return subsWithNumberOfPosts;
    }

}

module.exports = Sub;