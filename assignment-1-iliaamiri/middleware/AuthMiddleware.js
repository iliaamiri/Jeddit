const tokenModel = require('../models/Token');
const userModel = require('../models/User');

module.exports = (challenge = false) => (req, res, next) => {
    req.user = null;

    const session = req.session;

    if (session['authSession'] === undefined || session['authSession'] === null) {
        if (req._parsedUrl.pathname !== '/login' && challenge) {
            return res.redirect('/user/login');
        } else {
            return next();
        }
    }

    const authSession = session['authSession'];

    const Token = new tokenModel();
    const User = new userModel();

    let token = Token.getToken(authSession.value);

    if (token) {
        req.user = User.getUserByToken(token.value);

        req.session.authSession = token;

        return next();
    } else {
        if (req._parsedUrl.pathname !== '/login' && challenge) {
            return res.redirect('/user/login');
        } else {
            return next();
        }
    }
}