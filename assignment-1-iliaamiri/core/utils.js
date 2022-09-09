const crypto = require('crypto');

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateString = (length) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

    const generateNewToken = (rawValue) => {
    const hash = crypto.createHash('sha512');
    const data = hash.update(rawValue, 'utf-8');
    return data.digest('hex');
}

module.exports = {
    randomIntFromInterval,
    generateNewToken,
    generateString
}