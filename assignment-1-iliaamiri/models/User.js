const Model = require('../core/model');
const users = require('../core/fakeDB/data/users');
const tokens = require('../core/fakeDB/data/tokens');

class User extends Model {
    getUser(id) {
        return users[id];
    }

    getUserByToken(givenToken) {
        let matches = Object.values(tokens).filter(token => token.value === givenToken)[0];
        if (matches) {
            return this.getUser(matches.user_id);
        } else {
            return null;
        }
    }

    getUserByUsername(uname) {
        let relevant_user_object = Object.values(users).filter(user => user.uname === uname)[0];
        if (relevant_user_object) {
            return this.getUser(relevant_user_object.id);
        } else {
            return undefined;
        }
    }

    addUser(uname, password) {
        let id = Math.max(...Object.keys(users).map(Number)) + 1;
        let user = {
            id,
            uname,
            password,
        };
        users[id] = user;
        return user;
    }
}

module.exports = User