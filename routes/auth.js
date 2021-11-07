const { isAuth } = require('../config/helpers/isAuth')
const passport = require('passport');
const app = require('express').Router();
const bcrypt = require('bcrypt');
const helpers = require('../config/helpers/encrypt');
const pool = require('../config/settings/database');

app.get('/', async (req, res) => {
    res.render('auth/index', {
        section: 'Entrada a la cuenta'
    })
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/auth',
    failureFlash: true
}));

app.get('/logout', isAuth, async (req, res) => {
    req.logout();
    req.flash('success', 'Ha salido de la cuenta con éxito.');
    res.redirect('/');
})

app.get('/forgot', async (req, res) => {
    res.render('auth/forgot', {
        section: 'Recuperación de cuenta',
    })
})

app.post('/forgot', async (req, res) => {
    const { correo } = req.body
    const verifyUser = await pool.query('SELECT * FROM administrador WHERE correo = ?', [correo])
    const user = verifyUser[0]
    if (verifyUser.length) {
        res.redirect('/auth/vefq/' + user.id)
    } else {
        req.flash('warning', 'El correo electrónico ingresado no existe')
        res.redirect('/auth/forgot')
    }
})

app.get('/vefq/:id', async (req, res) => {
    const { id } = req.params
    const row =  await pool.query('SELECT * FROM administrador WHERE id = ?', [id])
    const user = row[0]
    res.render('auth/verify', {
        section: 'Verificación de identidad',
        user
    })
})

app.post('/verify', async (req, res) => {
    const { respuesta, id } = req.body
    const verifyUser = await pool.query('SELECT * FROM administrador WHERE id = ?', [id])
    const user = verifyUser[0]
    const match = await bcrypt.compareSync(respuesta, user.respuesta);
    if (match) {
        res.redirect('/auth/reset/' + user.id)
    } else {
        req.flash('danger', 'La validación falló, intentelo nuevamente')
        res.redirect('/auth')
    }
})

app.get('/reset/:id', async (req, res) => {
    const { id } = req.params
    const row =  await pool.query('SELECT * FROM administrador WHERE id = ?', [id])
    const user = row[0]
    res.render('auth/reset', {
        section: 'Restauración de la contraseña',
        user
    })
})

app.post('/reset', async (req, res) => {
    const { id, clave, clave_repeat } = req.body
    const errors = []

    if (clave <= 0 || clave_repeat <= 0) {
        errors.push('Los campos deben ser completados para continuar')
    }
    if (clave != clave_repeat) {
        errors.push('Las contraseñas no coinciden')
    }
    if (clave < 6) {
        errors.push('La contraseña debe ser mayor a 7 caracteres')
    }
    if (errors.length > 0) {
        const row = await pool.query('SELECT * FROM administrador WHERE id = ?', [id])
        const user = row[0]
        res.render('auth/reset', {
            section: 'Restauración de la contraseña',
            user,
            errors
        })
    } else {
        const claveHash = await helpers.encryptPassword(clave);
        const newUser = {
            clave: claveHash
        }
        try {
            await pool.query('UPDATE administrador SET ? WHERE id = ?', [newUser, id])

            req.flash('success', 'Se ha restableció la contraseña con éxito.');
            res.redirect('/auth');
        } catch (e) {
            console.log(e)
        }
    }
})

module.exports = app;