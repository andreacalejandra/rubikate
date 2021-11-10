const app = require('express').Router();
const HomeController = require('../controllers/HomeController')

app.get('/', HomeController.getIndex);

app.get('/about', HomeController.getAboutPage);

module.exports = app;