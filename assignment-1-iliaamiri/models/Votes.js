const Model = require('../core/model');
let votes = require('../core/fakeDB/data/votes');

class Vote extends Model {
    getVotesForPost(post_id) {
        return votes.filter(vote => vote.post_id === post_id);
    }

    getVote(user_id, post_id) {
        return votes.filter(vote => ((vote.post_id === Number(post_id)) && (vote.user_id === Number(user_id))))[0];
    }

    recordVote(user_id, post_id, vote_value) {
        votes.push({
            user_id: Number(user_id),
            post_id: Number(post_id),
            value: Number(vote_value)
        })
    }

    editVote(user_id, post_id, new_value) {
        let indexOfEditingArray;

        let vote;
        for (let index in votes) {
            vote = votes[index];
            if (vote.user_id === Number(user_id) && vote.post_id === Number(post_id)) {
                indexOfEditingArray = index;
                break;
            }
        }

        if (indexOfEditingArray === undefined) {
            return false;
        }

        votes.splice(indexOfEditingArray, 1, {
            user_id: vote.user_id,
            post_id: vote.post_id,
            value: Number(new_value)
        })

        return true;
    }
}

module.exports = Vote;