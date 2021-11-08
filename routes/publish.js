const app = require('express').Router();
const PublishController = require('../controllers/PublishController');

app.get('/:category/:page', PublishController.getCategoryPage );
app.post('/search', PublishController.postSearch );

module.exports = app;