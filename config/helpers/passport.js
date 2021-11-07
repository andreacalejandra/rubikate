const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../settings/database');
passport.use('local-login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, 
async function (req, username, password, done) {
    await pool.query('SELECT * FROM administrador WHERE usuario = ?', [username], async function(err, rows) {
        if (err) {
            return done(err);
        }
        if(!rows.length) {
            return done(null, false, req.flash('danger','¡Usuario no encontrado!. Intente nuevamente.'));
        } else {
            const user = rows[0];
            const match = bcrypt.compareSync(password, user.clave);
            if (!match) {
                return done(null, false, req.flash('warning','La contraseña no es correcta, intentelo nuevamente.'))
            } else {
                return done(null, user, req.flash('success','Bienvenido de nuevo, ' + user.usuario));
            }
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    await pool.query('SELECT * FROM administrador WHERE id = ?', [id], function(err, rows) {
        if (err) {
            return err;
        }
        done(null, rows[0]);
    });
    
});