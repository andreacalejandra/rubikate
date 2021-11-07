/**
    Library
 */
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { isAuth } = require('./config/helpers/isAuth');
const MySQLStore = require('express-mysql-session');
const { database } = require('./config/settings/key');
const cors = require('cors');


const path = require('path');
/**
    Initialization
 */
const app = express();
app.use(favicon(path.join(__dirname, 'public', 'img/site/favicon.ico')))
require('./config/helpers/passport');
require('./config/settings/config');
/**
    Statics
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
    Configuration
 */
app.use(cors());
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false
}));
app.set('view engine', 'pug');
let PORT = process.env.PORT || 3000;
let SECRET = process.env.SECRET_KEY || 's3cr3t k3y WoOWo'
/**
    Middleware
 */
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.set('trust proxy', 1);
var expiryDate = 600000;
app.use(session({
    secret: SECRET,
    resave: true,
    store: new MySQLStore(database),
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: expiryDate
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/**
    Globals
 */
app.use(function(req, res, next) {

    /**
     * Alerts // Notifications
     */
    res.locals.success = req.flash('success');
    res.locals.danger = req.flash('danger');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    res.locals.user = req.user || null;
    res.locals.title = 'Rubikate';

    next();
});
/**
    Server
 */

app.listen(PORT, () => {
    console.log('Server Online, port: ' + PORT);
});

/**
    Routes
 */
app.use(require('./routes/home'));
app.use('/plan', require('./routes/plans'));
app.use('/publish', require('./routes/publish'));
app.use('/admin', isAuth, require('./routes/admin'));
app.use('/auth', require('./routes/auth'));

/**
 * Error handler 404
 */
app.use(function(req, res, next) {
    res.status(404).render('error', {
        status: 404,
        section: '¡Página no encontrada!'
    })
})
/**
 * Error handler 500
 */
app.use(function(req, res, next) {
    res.status(500).render('error', {
        status: 500,
        section: '¡Hemos encontrado un error!'
    })
})