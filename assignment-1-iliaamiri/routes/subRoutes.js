const express = require("express");
const Controller = require('../controllers/subController.js');
const subRoutes = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

const subController = new Controller();

subRoutes.use(AuthMiddleware());

subRoutes.get('/', (req, res, next) => {
    subController.list(req, res, next)
})

subRoutes.get('/:subname', (req, res, next) => {
    subController.view(req, res, next)
})


module.exports = subRoutes;