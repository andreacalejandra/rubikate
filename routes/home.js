const pool = require('../config/settings/database');

const app = require('express').Router();

app.get('/', async (req, res) => {
    const row_ally = await pool.query('SELECT * FROM aliados');
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const countAllies = await pool.query('SELECT COUNT(*) AS rowsCount FROM aliados');
    const countUsers = await pool.query('SELECT COUNT(*) AS rows FROM usuarios');
    const countPublish = await pool.query('SELECT COUNT(*) AS rows FROM publicaciones');
    const nav_categories = await pool.query('SELECT * FROM categorias');
    const users = countUsers[0].rows;
    const publishs = countPublish[0].rows;
    const allies = countAllies[0].rowsCount;
    const carrusel = await pool.query('SELECT * FROM carrusel');
    const city = await pool.query('SELECT * FROM ciudades')

    const top = await pool.query('SELECT * FROM emprendimientos, publicaciones, fotos, usuarios WHERE usuarios.idusuario = emprendimientos.idusuario AND emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.idpublicacion = fotos.idpublicacion AND publicaciones.top = 1')
    res.render('home/index', {
        section: 'Inicio',
        nav_categories,
        site,
        users,
        city,
        allies,
        publishs,
        carrusel,
        row_ally,
        top
    })
});

app.get('/about', async (req, res) => {
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const nav_categories = await pool.query('SELECT * FROM categorias');
    const carrusel = await pool.query('SELECT * FROM carrusel');
    res.render('home/about', {
        section: 'Nosotros',
        nav_categories,
        site,
        carrusel
    })
});

module.exports = app;