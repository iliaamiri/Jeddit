const userModel = require('../models/User');
const tokenModel = require('../models/Token');
const User = new userModel();
const Token = new tokenModel();

class AuthController {
    login(req, res, next) {
        const user = req.user;

        if (user !== null) {
            return res.redirect('/user/profile')
        }

        res.render('auth/login', { user: user });
    }

    loginSubmit(req, res, next) {
        const params = req.body;
        const givenUsername = params.username;
        const givenPassword = params.password;

        try {
            if (givenUsername === undefined || givenPassword === undefined
            || givenUsername.length < 3 || givenPassword.length < 1) {
                throw "Invalid username/password";
            }

            const userExists = User.getUserByUsername(givenUsername);

            if (!userExists || userExists.password !== givenPassword) {
                throw "Invalid username/password";
            }

            req.session.authSession = Token.newToken(userExists.id);

            return res.json({
                status: 1,
                msg: "success"
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    logout(req, res, next) {
        const givenToken = req.session.authSession;
        if (givenToken !== undefined) {
            Token.removeByTokenValue(givenToken.value);
            req.session.authSession = null;
        }

        res.redirect("/");
    }


    signUp(req, res, next) {
        res.render('auth/signUp', {user:undefined})
    }

    signUpSubmit(req, res, next) {
        const params = req.body;
        const givenUsername = params.username;
        const givenPassword = params.password;

        try {
            if (givenUsername === undefined || givenPassword === undefined
                || givenUsername.length < 3 || givenPassword.length < 1) {
                throw "Invalid username/password";
            }

            const userExists = User.getUserByUsername(givenUsername);

            if (userExists) {
                throw "User already exists";
            }

            const newUser = User.addUser(givenUsername, givenPassword)

            req.session.authSession = Token.newToken(newUser.id);

            return res.json({
                status: 1,
                msg: "success"
            })
        } catch (e) {
            return res.json({
                status: 0,
                msg: e
            })
        }
    }

    viewProfile(req, res, next) {
        res.render('user/profile', {user: req.user})
    }
}

module.exports = AuthController;