const Model = require('../core/model');
let tokens = require('../core/fakeDB/data/tokens');

const { generateNewToken, generateString } = require('../core/utils');

class Token extends Model {
    getToken(tokenValue) {
        let token = Object.values(tokens).filter(token => tokenValue === token.value);
        if (token.length > 0) {
            return token[0]
        } else {
            return null;
        }
    }

    newToken(user_id) {
        const newTokenValue = generateNewToken(user_id + Math.random() + generateString(10));

        const newTokenRecord = {
            value: newTokenValue,
            user_id: user_id
        };

        tokens[newTokenValue] = newTokenRecord
        return newTokenRecord;
    }

    removeByTokenValue(tokenValue) {
        delete tokens[tokenValue];
    }
}

module.exports = Token;