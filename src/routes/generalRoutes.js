const express = require("express");
const Controller = require('../controllers/homeController.js');
const homeController = new Controller();

const generalRoutes = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

generalRoutes.get('/', AuthMiddleware(), (req, res, next) => {
    homeController.index(req, res, next)
})


module.exports = generalRoutes;