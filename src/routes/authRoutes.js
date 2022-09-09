const express = require("express");
const Controller = require('../controllers/authController.js');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const authRoutes = express.Router();

const authController = new Controller();

authRoutes.get('/logout', (req, res, next) => {
    authController.logout(req, res, next);
})

authRoutes.get('/signup', (req, res, next) => {
    authController.signUp(req, res, next);
})

authRoutes.post('/signup', (req, res, next) => {
    authController.signUpSubmit(req, res, next);
})

authRoutes.use(AuthMiddleware(true));

authRoutes.get('/login', (req, res, next) => {
    authController.login(req, res, next);
})

authRoutes.post('/login', (req, res, next) => {
    authController.loginSubmit(req, res, next);
})

authRoutes.get('/profile', (req, res, next) => {
    authController.viewProfile(req, res, next);
})

module.exports = authRoutes;