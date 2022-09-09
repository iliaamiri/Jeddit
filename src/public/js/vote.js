const getVoteIcons = (post_id) => {
    return {upVoteIcon: $("#upVoteIcon-" + post_id), downVoteIcon: $("#downVoteIcon-" + post_id)}
}

const getCurrentVoteInput = (post_id) => {
    return $("#currentVoteValue-" + post_id);
}

function vote(direction, user_id, post_id) {
    const current_vote_value = Number(getCurrentVoteInput(post_id).val());

    if (current_vote_value === 0) {
        switch (direction) {
            case "up":
                updateVoteValue(user_id, post_id, 1);
                break;
            case "down":
                updateVoteValue(user_id, post_id, -1);
                break;
        }
    } else {
        updateVoteValue(user_id, post_id, 0);
    }
}

function updateVoteValue(user_id, post_id, new_vote_value) {

    $.post("/posts/vote/" + post_id,
        {
            new_vote_value: new_vote_value
        },
        function (data, httpStatus) {
            const status = data.status;
            const newNetVotes = data.new_net_votes;
            const updatedVoteValue = data.updated_vote_value;
            const msg = data.msg;

            if (status === 1) {
                // Updating the buttons' colors
                switch (new_vote_value) {
                    case +1:
                        activateVoteButton("up", post_id);
                        break;
                    case -1:
                        activateVoteButton("down", post_id);
                        break;
                    case 0:
                        neutralize(post_id);
                        break;
                }

                // Updating the net votes
                updatePostNetVote(post_id, newNetVotes);

                // Updating the current vote
                getCurrentVoteInput(post_id).val(updatedVoteValue);
            } else {
                $("#errorMessage").show();
                console.log(msg)
            }
        });
}

function updatePostNetVote(post_id, newNetVotes) {
    const postNetVotes = $("#postNetVotes-" + post_id);

    postNetVotes.html(newNetVotes);
}

function activateVoteButton(direction, post_id) {
    const {upVoteIcon, downVoteIcon} = getVoteIcons(post_id);

    if (direction === "up") {
        upVoteIcon.replaceWith('<i id="upVoteIcon-' + post_id + '" class="bi bi-caret-up-square-fill"></i>');
        downVoteIcon.replaceWith('<i id="downVoteIcon-' + post_id + '" class="bi bi-caret-down-square"></i>');
    } else {
        upVoteIcon.replaceWith('<i id="upVoteIcon-' + post_id + '" class="bi bi-caret-up-square"></i>');
        downVoteIcon.replaceWith('<i id="downVoteIcon-' + post_id + '" class="bi bi-caret-down-square-fill"></i>');
    }
}

function neutralize(post_id) {
    const {upVoteIcon, downVoteIcon} = getVoteIcons(post_id);

    upVoteIcon.replaceWith('<i id="upVoteIcon-' + post_id + '" class="bi bi-caret-up-square"></i>');
    downVoteIcon.replaceWith('<i id="downVoteIcon-' + post_id + '" class="bi bi-caret-down-square"></i>');
}
