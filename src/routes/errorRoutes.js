const express = require("express");
const AuthMiddleware = require('../middleware/AuthMiddleware');
const errorRoutes = express.Router();

errorRoutes.use(AuthMiddleware());

errorRoutes.get('/403', (req, res, next) => {
    res.render("layouts/403", { user: req.user })
})

errorRoutes.get('/404', (req, res, next) => {
    res.render("layouts/404", { user: req.user })
})

errorRoutes.get('/500', (req, res, next) => {
    res.render("layouts/500", { user: req.user })
})

module.exports = errorRoutes