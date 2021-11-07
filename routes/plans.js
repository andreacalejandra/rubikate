const pool = require('../config/settings/database');
const nodemailer = require('nodemailer');
// initialization router
const app = require('express').Router();
const fs = require('fs');
/**
 * Multer settings
 * */
// #start
const multer = require('multer');
const path = require('path');
const { verify } = require('crypto');
// imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = path.join(__dirname, '../public/img/emprendimientos/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) return err;
            })
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
  });
const upload = multer({ storage });
/**
 * Routes
 */
app.get('/', async (req, res) => {
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const nav_categories = await pool.query('SELECT * FROM categorias');
    const plans = await pool.query('SELECT * FROM planes');
    const carrusel = await pool.query('SELECT * FROM carrusel');
    res.render('plan/plans', {
        section: 'Planes',
        plans,
        nav_categories,
        site,
        carrusel
    })
});

app.get('/needed/register/:idplan', async (req, res) => {
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const nav_categories = await pool.query('SELECT * FROM categorias');
    const states = await pool.query('SELECT * FROM estados');
    const cities = await pool.query('SELECT * FROM ciudades');
    const carrusel = await pool.query('SELECT * FROM carrusel');
    const { idplan } = req.params;
    res.render('plan/register', {
        section: 'Registro de usuario',
        idplan,
        nav_categories,
        site,
        states,
        cities,
        carrusel
    })
});

const uploads = upload.fields( 
    [ 
        { 
            name:'images',
            maxCount:6
        }, 
        { 
            name:'logo', 
            maxCount: 1 
        } 
    ])
app.post('/registered', uploads, async (req, res, next) => {
    const dir = '/img/emprendimientos/'
    const logo = req.files['logo'];
    const images = req.files['images'];
    
    const { 
            correo,
            emprendimiento,
            descripcion,  
            delivery, 
            municipio, 
            redesSociales, 
            url, 
            idplan,
            direccion
        } = req.body;    


    const verifyUser = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);


    if (!verifyUser.length) {
        req.flash('warning', 'El correo ingresado no existe.')
        res.redirect('/plan')
    } else {
        const row_user = await pool.query('SELECT idusuario FROM usuarios WHERE correo = ?', [correo]);
        const idusuario = row_user[0].idusuario;
        const rows = await pool.query('SELECT idciudad FROM ciudades WHERE ciudad = ?', [municipio]);
        const idciudad = rows[0].idciudad;
        const user = verifyUser[0]
        // Emprendimiento
        try {
            if (redesSociales === undefined) {
                const newShip = {
                    emprendimiento,
                    descripcion,
                    idusuario,
                    logo: dir + logo[0]['filename'],
                    telefono: user.telefono,
                    delivery,
                    idciudad,
                    direccion
                };
                await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
            }
            if (redesSociales === 'facebook') {
                const newShip = {
                    emprendimiento,
                    descripcion,
                    idusuario,
                    logo: dir + logo[0]['filename'],
                    telefono: user.telefono,
                    delivery,
                    idciudad,
                    redesSociales,
                    urlRedesSociales : url,
                    direccion
                };
                await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
            }
            if (redesSociales === 'twitter') {
                const newShip = {
                    emprendimiento,
                    descripcion,
                    idusuario,
                    logo: dir + logo[0]['filename'],
                    telefono: user.telefono,
                    delivery,
                    idciudad,
                    redesSociales,
                    urlRedesSociales : url,
                    direccion
                };
                await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
            }
            if (redesSociales === 'instagram') {
                if (url.includes('@')) {
                    const newUrl = url.slice(1)
                    const newShip = {
                        emprendimiento,
                        descripcion,
                        idusuario,
                        logo: dir + logo[0]['filename'],
                        telefono: user.telefono,
                        delivery,
                        idciudad,
                        redesSociales,
                        urlRedesSociales : newUrl,
                        direccion
                    }
                    await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
                } else {
                    const newShip = {
                        emprendimiento,
                        descripcion,
                        idusuario,
                        logo: dir + logo[0]['filename'],
                        telefono: user.telefono,
                        delivery,
                        idciudad,
                        redesSociales,
                        urlRedesSociales : url,
                        direccion
                    }
                    await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
                }
            }
        } catch (error) {
            throw new Error(error)   
        }
        // Publicación
        const rows_emprendimiento = await pool.query('SELECT idemprendimiento FROM emprendimientos WHERE emprendimiento = ?', [emprendimiento]);
        const idemprendimiento = rows_emprendimiento[0].idemprendimiento
        try {        
            const newPublish = {
                idplan,
                idemprendimiento,
                status: 3
            }

            await pool.query('INSERT INTO publicaciones SET ?', [newPublish])
        } catch (error) {
            await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento = ?', [idemprendimiento])
            throw new Error(error)
        }
        // Fotos
        const rows_publicacion = await pool.query('SELECT idpublicacion FROM publicaciones WHERE idemprendimiento = ?', [idemprendimiento])
        const idpublicacion = rows_publicacion[0].idpublicacion; 

        try {    
            if (!images) {
                const newPhotos = {
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
                
        } else {
            if (images.length == 1) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
            if (images.length == 2) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    foto2: dir + images[1]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
        
            if (images.length == 3) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    foto2: dir + images[1]['filename'],
                    foto3: dir + images[2]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
        
            if (images.length == 4) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    foto2: dir + images[1]['filename'],
                    foto3: dir + images[2]['filename'],
                    foto4: dir + images[3]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
            if (images.length == 5) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    foto2: dir + images[1]['filename'],
                    foto3: dir + images[2]['filename'],
                    foto4: dir + images[3]['filename'],
                    foto5: dir + images[4]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
            if (images.length == 6) {
                const newPhotos = {
                    foto1: dir + images[0]['filename'],
                    foto2: dir + images[1]['filename'],
                    foto3: dir + images[2]['filename'],
                    foto4: dir + images[3]['filename'],
                    foto5: dir + images[4]['filename'],
                    foto6: dir + images[5]['filename'],
                    idpublicacion
                }
                await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            }
        }    
        } catch (error) {
            await pool.query('DELETE FROM publicaciones WHERE idpublicacion = ?', [idpublicacion])
            await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento = ?', [idemprendimiento])
            throw new Error(error)
        }
    res.redirect('/plan/register/done');  
    }
})

app.post('/register', uploads, async function(req, res, next) {
    const logo = req.files['logo'];
    const images = req.files['images'];
     const { 
        nombre, 
        apellido, 
        nacionalidad, 
        ci, 
        correo, 
        telefono,
        idplan,
        emprendimiento, 
        descripcion, 
        delivery, 
        municipio, 
        redesSociales, 
        url, 
        direccion,
    } = req.body;

    const dir = '/img/emprendimientos/'
    const rows = await pool.query('SELECT idciudad FROM ciudades WHERE ciudad = ?', [municipio]);
    const idciudad = rows[0].idciudad;
    const cedula = nacionalidad + '-' + ci
    const verifyUser = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);   
    if (verifyUser.length) {
        req.flash('danger', 'El usuario ingresado ya fue registrado.')
        res.redirect('/plan')
    }
    // Usuario
    try {
        const newUser = {
            nombre,
            apellido,
            cedula,
            telefono,
            correo
        }

        await pool.query('INSERT INTO usuarios SET ?', [newUser])
    } catch (error) {
        throw new Error(error)
    }
    
    const row_user = await pool.query('SELECT idusuario FROM usuarios WHERE correo = ?', [correo]);
    const idusuario = row_user[0].idusuario;  
    // Emprendimiento
    try {
        console.log(idusuario)  
        if (redesSociales === undefined) {
            const newShip = {
                emprendimiento,
                descripcion,
                idusuario,
                logo: dir + logo[0]['filename'],
                telefono,
                delivery,
                idciudad,
                direccion
            };
            await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
        }

        if (redesSociales === 'facebook') {
            const newShip = {
                emprendimiento,
                descripcion,
                idusuario,
                logo: dir + logo[0]['filename'],
                telefono,
                delivery,
                idciudad,
                redesSociales,
                urlRedesSociales : url,
                direccion
            };
            await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
        }

        if (redesSociales === 'twitter') {
            const newShip = {
                emprendimiento,
                descripcion,
                idusuario,
                logo: dir + logo[0]['filename'],
                telefono,
                delivery,
                idciudad,
                redesSociales,
                urlRedesSociales : url,
                direccion
            };
            await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
        }
        if (redesSociales === 'instagram') {
            if (url.includes('@')) {
                const newUrl = url.slice(1)
                const newShip = {
                    emprendimiento,
                    descripcion,
                    idusuario,
                    logo: dir + logo[0]['filename'],
                    telefono,
                    delivery,
                    idciudad,
                    redesSociales,
                    urlRedesSociales : newUrl,
                    direccion
                }
                await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
            } else {
                const newShip = {
                    emprendimiento,
                    descripcion,
                    idusuario,
                    logo: dir + logo[0]['filename'],
                    telefono,
                    delivery,
                    idciudad,
                    redesSociales,
                    urlRedesSociales : url,
                    direccion
                }
                await pool.query('INSERT INTO emprendimientos SET ?', [newShip])
            }
        }
    } catch (error) {
        await pool.query('DELETE FROM usuarios WHERE idusuario = ?', [idusuario])
        throw new Error(error)   
    }

    const rows_emprendimiento = await pool.query('SELECT idemprendimiento FROM emprendimientos WHERE emprendimiento = ?', [emprendimiento]);
    const idemprendimiento = rows_emprendimiento[0].idemprendimiento
    // Publicacion
    try {        
        const newPublish = {
            idplan,
            idemprendimiento,
            status: 3
        }

        await pool.query('INSERT INTO publicaciones SET ?', [newPublish])
    } catch (error) {
        await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento = ?', [idemprendimiento])
        await pool.query('DELETE FROM usuarios WHERE idusuario = ?', [idusuario])
        throw new Error(error)
    }
    
    const rows_publicacion = await pool.query('SELECT idpublicacion FROM publicaciones WHERE idemprendimiento = ?', [idemprendimiento])
    const idpublicacion = rows_publicacion[0].idpublicacion; 
    // Fotos
    try {    
        if (!images) {
            const newPhotos = {
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
            
    } else {
        if (images.length == 1) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
        if (images.length == 2) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                foto2: dir + images[1]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
    
        if (images.length == 3) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                foto2: dir + images[1]['filename'],
                foto3: dir + images[2]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
    
        if (images.length == 4) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                foto2: dir + images[1]['filename'],
                foto3: dir + images[2]['filename'],
                foto4: dir + images[3]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
        if (images.length == 5) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                foto2: dir + images[1]['filename'],
                foto3: dir + images[2]['filename'],
                foto4: dir + images[3]['filename'],
                foto5: dir + images[4]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
        if (images.length == 6) {
            const newPhotos = {
                foto1: dir + images[0]['filename'],
                foto2: dir + images[1]['filename'],
                foto3: dir + images[2]['filename'],
                foto4: dir + images[3]['filename'],
                foto5: dir + images[4]['filename'],
                foto6: dir + images[5]['filename'],
                idpublicacion
            }
            await pool.query('INSERT INTO fotos SET ?', [newPhotos])
        }
    }    
    } catch (error) {
        await pool.query('DELETE FROM publicaciones WHERE idpublicacion = ?', [idpublicacion])
        await pool.query('DELETE FROM emprendimientos WHERE idemprendimiento = ?', [idemprendimiento])
        await pool.query('DELETE FROM usuarios WHERE idusuario = ?', [idusuario])
        throw new Error(error)
    }
    res.redirect('/plan/register/done');  
})


app.get('/register/done', async (req, res) => {
    const row_site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    const site = row_site[0];
    const nav_categories = await pool.query('SELECT * FROM categorias');
    res.render('plan/done', {
        section: 'Solicitud enviada',
        site,
        nav_categories
    })
})
module.exports = app;