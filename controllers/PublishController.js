const pool = require('../config/settings/database');

exports.getCategoryPage = async (req, res) => {
    // General
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const carrusel = await pool.query('SELECT * FROM carrusel');
    // Categories
    const { category } = req.params;
    if (category < 13 ) {
        // System
        const nav_categories = await pool.query('SELECT * FROM categorias');
        const categories = await pool.query('SELECT * FROM categorias WHERE idcategoria = ?', [category]);
        const row_category = await pool.query('SELECT * FROM categorias WHERE idcategoria = ?', [categories[0].idcategoria]);
        const title = row_category[0].nombre;
        const subcategories = await pool.query('SELECT * FROM categorias WHERE idpadre = ?', [category]);
        const city = await pool.query('SELECT ciudad, idciudad FROM ciudades')
        // Pagination
        let { page } = req.params;
        let countPage = parseInt(page);
        const limit = 12;
        const currentPage = countPage;
        const offset = page ? page * limit : 0;
        const countItems = await pool.query('SELECT COUNT(*) AS rows FROM emprendimientos INNER JOIN categorias ON emprendimientos.idcategoria = categorias.idcategoria AND categorias.idpadre = ?', [category]);
        const count = parseInt(countItems[0].rows);
        const totalPages = Math.ceil(count / limit);
        try {
            const result = await pool.query('select distinct * FROM emprendimientos, publicaciones, fotos, usuarios, categorias WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND emprendimientos.idcategoria = categorias.idcategoria AND publicaciones.idpublicacion = fotos.idpublicacion AND categorias.idpadre = ' + category + ' AND publicaciones.status = 1 AND emprendimientos.idusuario = usuarios.idusuario LIMIT ' + limit + ' OFFSET ' + offset, async (err, doc) => {
                if (err) {
                    return err;
                } else {
                    res.render('home/publish', {
                        data : doc,
                        site,
                        carrusel,
                        city,
                        nav_categories,
                        categories,
                        title,
                        city,
                        subcategories,
                        count,
                        currentPage,
                        totalPages,
                    })
                } 
            });
        } catch (error) {
            console.log(e);
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/');
        }  
    } else {
        // System
        const nav_categories = await pool.query('SELECT * FROM categorias');
        const categories = await pool.query('SELECT * FROM categorias WHERE idcategoria = ?', [category]);
        const row_category = await pool.query('SELECT * FROM categorias WHERE idcategoria = ?', [categories[0].idpadre]);
        const title = row_category[0].nombre;
        const subcategories = await pool.query('SELECT * FROM categorias WHERE idpadre = ?', [categories[0].idpadre]);
        const city = await pool.query('SELECT * FROM ciudades')
        // Pagination
        let { page } = req.params;
        let countPage = parseInt(page);
        const limit = 12;
        const currentPage = countPage;
        const offset = page ? page * limit : 0;
        const countItems = await pool.query('SELECT COUNT(*) AS rows FROM emprendimientos WHERE idcategoria = ?', [category]);
        const count = parseInt(countItems[0].rows);
        const totalPages = Math.ceil(count / limit);
        try {
            const result = await pool.query('select * from emprendimientos, publicaciones, fotos where emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.idpublicacion = fotos.idpublicacion AND emprendimientos.idcategoria = ' + category + ' LIMIT ' + limit + ' OFFSET ' + offset, async (err, doc) => {
                if (err) {
                    return err;
                } else {
                    res.render('home/publish', {
                        data : doc,
                        site,
                        carrusel,
                        nav_categories,
                        categories,
                        city,
                        title,
                        subcategories,
                        count,
                        currentPage,
                        totalPages,
                    })
                } 
            });
        } catch (error) {
            console.log(e);
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/');
        }  
    }   
};

exports.postSearch = async (req, res) => {
    const { category, city } = req.body;
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const nav_categories = await pool.query('SELECT * FROM categorias');
    const cities = await pool.query('SELECT * FROM ciudades')
    try {
        if (!category && !city) {
            req.flash('danger', 'No ha seleccionado ningun objetivo de busqueda.');
            res.redirect('/');
        }
        if (category === undefined) {
            const rows = await pool.query('SELECT idciudad FROM ciudades WHERE ciudad = ?', [city]);
            const idciudad = rows[0].idciudad;
            const result = await pool.query('select * from emprendimientos, publicaciones, fotos where emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.idpublicacion = fotos.idpublicacion AND emprendimientos.idciudad = ?', [idciudad]);
            res.render('home/search', {
                section: 'Resultados de la busqueda',
                nav_categories,
                site,
                result,
                cities
            })
        } 
        if (city === undefined) {
            
            const result = await pool.query('SELECT * FROM emprendimientos, publicaciones, fotos WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.idpublicacion = fotos.idpublicacion AND emprendimientos.idcategoria = ' + category);
            res.render('home/search', {
                section: 'Resultados de la busqueda',
                nav_categories,
                site,
                result,
                cities
            })
            res.json(result)
        }
        if (city && category) {
            const rows = await pool.query('SELECT idciudad FROM ciudades WHERE ciudad = ?', [city]);
            const idciudad = rows[0].idciudad;
            const result = await pool.query('SELECT * FROM emprendimientos, publicaciones, fotos WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.idpublicacion = fotos.idpublicacion AND emprendimientos.idcategoria = ' + category + ' AND emprendimientos.idciudad = ' + idciudad) ;
            res.render('home/search', {
                section: 'Resultados de la busqueda',
                nav_categories,
                site,
                result,
                cities
            })
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/');        
    }
};
