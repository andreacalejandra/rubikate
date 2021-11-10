const passport = require('passport');
const app = require('express').Router();
const { isAuth } = require('../config/helpers/isAuth')
const AuthController = require('../controllers/AuthController')

app.get('/', AuthController.getAuthPage);

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/auth',
    failureFlash: true
}));

app.get('/logout', isAuth, AuthController.getLogout)

app.get('/forgot', AuthController.getForgot)

app.post('/forgot', AuthController.postForgot)

app.get('/vefq/:id', AuthController.getVerify)

app.post('/verify', AuthController.postVerify)

app.get('/reset/:id', AuthController.getResetPwd)

app.post('/reset', AuthController.postResetPwd)

module.exports = app;