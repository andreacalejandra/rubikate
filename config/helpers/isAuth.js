const helpers = {};
helpers.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('danger', 'No tiene permitida la entrada.');
    res.redirect('/auth');
};

module.exports = helpers;