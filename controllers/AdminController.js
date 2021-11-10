const { isAuth } = require('../config/helpers/isAuth');
const pool = require('../config/settings/database');
const app = require('express').Router();
const moment = require('moment')
const helpers = require('../config/helpers/encrypt');

exports.getAdminPage = async (req, res) => {
    /**
     * Count - Stats
     */
     const countAllies = await pool.query('SELECT COUNT(*) AS rowsCount FROM aliados');
     const countPublish = await pool.query('SELECT COUNT(*) AS rowsCount FROM publicaciones WHERE status = 1 OR status = 2');
     const countUser = await pool.query('SELECT COUNT(*) AS rowsCount FROM usuarios');
     const aCount = countAllies[0].rowsCount;
     const pCount = countPublish[0].rowsCount;
     const uCount = countUser[0].rowsCount;
     /**
      * Query - General
      */
     const users = await pool.query('SELECT * FROM administrador');
     const plans = await pool.query('SELECT *  FROM planes');;
     const siteRow = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
     const categories = await pool.query('SELECT * FROM categorias');
     const cities = await pool.query('SELECT * FROM ciudades');
     const states = await pool.query('SELECT * FROM estados');
     const panels = await pool.query('SELECT * FROM emprendimientos, publicaciones WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.status = 3')
     const publishs = await pool.query('SELECT * FROM emprendimientos, publicaciones, categorias WHERE emprendimientos.idcategoria = categorias.idcategoria AND emprendimientos.idemprendimiento = publicaciones.idemprendimiento');
     const allies = await pool.query('SELECT * FROM aliados');
     const sliders = await pool.query('SELECT * FROM carrusel');
 
     const site = siteRow[0];
     res.render('admin/index', {
         section: 'Panel de Control',
         uCount,
         pCount,
         aCount,
         users,
         plans,
         categories,
         cities,
         states,
         site,
         panels,
         publishs,
         allies,
         sliders
     })
}

exports.getNotifyPage = async (req, res) => {
    const notifys = await pool.query('SELECT * FROM acciones, auditorias, administrador WHERE acciones.idaccion = auditorias.idaccion AND auditorias.idadministrador = administrador.id')
    res.render('admin/sections/notify/index', {
        section: 'Panel de notificaciones',
        notifys
    })
}

exports.getPanelPage = async (req, res) => {
    const result = await pool.query('SELECT * FROM emprendimientos, publicaciones WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND publicaciones.status = 3')
    res.render('admin/sections/panel/index', {
        section: 'Panel de solicitudes',
        result
    })
}

exports.getPanelView = async (req, res) => {
    const { id } = req.params;
    const rows_e = await pool.query('SELECT * FROM emprendimientos WHERE idemprendimiento = ?', [id]);
    const results = rows_e[0].idemprendimiento;
    const rows_p = await pool.query('SELECT * FROM publicaciones WHERE idemprendimiento = ?', [results]);
    const results2 = rows_p[0].idpublicacion
    const idusuario = rows_e[0].idusuario
    const idplan = rows_p[0].idplan;
    const user = await pool.query('SELECT * FROM usuarios WHERE idusuario = ?', [idusuario])
    const photos = await pool.query('SELECT * FROM fotos WHERE idpublicacion = ?', [results2]);
    const title = rows_e[0].emprendimiento;
    const rows_c = await pool.query('SELECT * FROM ciudades, estados WHERE ciudades.idciudad = ? AND ciudades.idestado = estados.idestado', [rows_e[0].idciudad]);
    const rows_plan = await pool.query('SELECT nombre FROM planes WHERE idplan = ?', [idplan]);
    const plan = rows_plan[0].nombre;
    const categories = await pool.query('SELECT * FROM categorias');
    res.render('admin/sections/panel/view', {
        section: 'Visualizando: ' + title,
        title,
        rows_e,
        rows_p,
        user,
        plan,
        rows_c,
        photos,
        results,
        categories      
    })
}

exports.postChangeEnablePanel = async (req, res) => {
    const { idpublicacion, idplan, categories, idemprendimiento } = req.body;    
    const row_plan = await pool.query('SELECT duracion FROM planes WHERE idplan = ?', [idplan])
    const duration = row_plan[0].duracion
    const fecha_init = moment().add(duration, 'M').add(1, 'd').startOf('d').subtract(1, 'm')
    const fecha = fecha_init.format("YYYY-MM-DD HH:mm:ss");
    const newShip = {
        idcategoria: categories
    }

    const newPublish = {
        fecha,
        status: 1
    }
    try {
        await pool.query('UPDATE emprendimientos SET ? WHERE idemprendimiento = ?', [newShip, idemprendimiento])
        await pool.query('UPDATE publicaciones SET ? WHERE idpublicacion = ?', [newPublish, idpublicacion])

        let accion = 'Se aceptó un emprendimiento.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'publicaciones'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/panel');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/panel/');
    }
}

exports.postChangeDisablePanel = async (req, res) => {
    const { idpublicacion, observacion } = req.body;
    const newNotify = {
        idpublicacion,
        observacion
    }
    const errors = [];
    try {
        if (observacion.lenght <= 0) {
            errors.push('Los campos son necesarios para continuar');
        }
        if (errors > 0) {
            req.flash('danger', 'No se pudo realizar el proceso, intentelo nuevamente')
            res.redirect('/admin/panel/');
        } else {
            await pool.query('INSERT INTO notificaciones SET ?', [newNotify]);
            await pool.query('UPDATE publicaciones SET status = 0 WHERE idpublicacion = ?', [idpublicacion]);

            let accion = 'Se denegó un emprendimiento.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'publicaciones'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/panel');
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/panel/');
    }
}

exports.getUserPage = async (req, res) => {
    const users = await pool.query('SELECT * FROM administrador');
    res.render('admin/sections/user/index', {
        section: 'Manejo de administradores',
        users
    })
}

exports.getUserCreate = async (req, res) => {
    res.render('admin/sections/user/action', {
        section: 'Agregar nuevo administrador',
    })
}

exports.getUserUpdate = async (req, res) => {
    const { id } = req.params;
    const rest = await pool.query('SELECT * FROM administrador WHERE id = ?', [id]);
    const result = rest[0];
    res.render('admin/sections/user/action', {
        section: 'Actualizar administrador',
        result
    })
}

exports.userDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM administrador WHERE id = ?', [id])
        
        let accion = 'Se borró un administrador.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'administrador'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/user');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/user');
    }
}

exports.postUserCreate = async (res, req) => {
    const errors = [];
    const { usuario, clave, clave_repeat, pregunta, respuesta, correo } = req.body;
    console.log(usuario, clave, clave_repeat, pregunta, respuesta, correo)
    const claveHash = await helpers.encryptPassword(clave);
    const respHash = await helpers.encryptPassword(respuesta);
    const newUser = {
        usuario,
        clave: claveHash,
        correo,
        rol: 1,
        pregunta,
        respuesta: respHash
    };
    try {
        if (usuario.lenght <= 0 || clave.lenght <= 0 || clave_repeat.lenght <= 0 || pregunta.lenght <= 0 || respuesta.lenght <= 0 || correo.lenght <= 0) {
        errors.push('Todos los campos son necesarios para continuar.');
        }
        if (clave.lenght < 6) {
            errors.push('La contraseña no puede ser menor a 7 caracteres.');
        }
        if (clave != clave_repeat) {
            errors.push('Las contraseñas no coinciden, por favor intentelo nuevamente.')
        }
        if (errors.lenght > 0) {
            res.render('admin/sections/user/action', {
                section: 'Agregar nuevo administrador',
                errors,
                usuario
            })
        } else {
            await pool.query('INSERT INTO administrador SET ?', [newUser]);
    
            let accion = 'Se agregó un nuevo administrador.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'administrador'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/user');

        }
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/user');
    }
}

exports.postUserUpdate = async (req, res) => {
    const errors = [];
    const { clave, id, clave_repeat } = req.body;
    try {
        if (clave.lenght <= 0) {
        errors.push('Todos los campos son necesarios para continuar.');
        }
        if (clave.lenght < 6) {
            errors.push('La contraseña no puede ser menor a 7 caracteres.');
        }
        if (clave != clave_repeat) {
            errors.push('Las contraseñas no coinciden, por favor intentelo nuevamente.');
        }
        if (errors.lenght > 0) {
            res.render('admin/sections/user/action', {
                section: 'Actualizar administrador',
                id,
                clave,
                result: true,
                errors
            })
        } else {
            const claveHash = await helpers.encryptPassword(clave);
            const newUser = {
                clave: claveHash
            };
            await pool.query('UPDATE administrador SET ? WHERE id = ?', [newUser, id]);
    
            let accion = 'Se actualizó el usuario de un administrador.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'administrador'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/user');

            }
    } catch (e) {
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/user');
    }
}

exports.getPlanPage = async (req, res) => {
    const result = await pool.query('SELECT * FROM planes');
    res.render('admin/sections/plan/index', {
        section: 'Administración de Planes',
        result
    })
}

exports.getPlanUpdate = async (req, res) => {
    const { id } = req.params
    const rest = await pool.query('SELECT * FROM planes WHERE idplan = ?', [id]);
    const result = rest[0];
    res.render('admin/sections/plan/action', {
        section: 'Modificar Plan',
        result
    })
}

exports.getPlanCreate = async (req, res) => {
    res.render('admin/sections/plan/action', {
        section: 'Agregar Plan'
    })
}

exports.postPlanCreate = async (req, res) => {
    const { nombre, descripcion, costo, duracion } = req.body;
    const newPlan = {
        nombre,
        descripcion,
        costo,
        duracion
    }
    
    const errors = [];
    try {
        if (nombre.lenght <= 0 || descripcion.lenght <= 0 || costo <= 0, duracion <= 0) {
            errors.push('Los campos son necesarios para continuar');
        }
        if (errors.lenght > 0) {
            res.render('admin/sections/plan/action', {
                section: 'Agregar Plan',
                errors
            })
        } else {
            await pool.query('INSERT INTO planes SET ?', [newPlan]);

            let accion = 'Se agregó un nuevo plan.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'planes'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/plan');
        }
    } catch (e) {
        console.error(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/plan');
    }
}

exports.postPlanUpdate = async (req, res) => {
    const { id, nombre, descripcion, costo, duracion } = req.body;
    const newPlan = {
        nombre,
        descripcion,
        costo,
        duracion
    };
    const errors = [];
    try {
        if (nombre.lenght <= 0 || descripcion.lenght <= 0 || costo <= 0, duracion <= 0) {
            errors.push('Los campos son necesarios para continuar');
        }
        if(errors.lenght > 0) {
            res.render('admin/sections/plan/action', {
                nombre,
                descripcion,
                costo,
                duracion,
                id,
                result: true,
                errors
            })   
        } else {
            await pool.query('UPDATE planes SET ? WHERE idplan= ?', [newPlan, id]);
            
            let accion = 'Se actualizó un plan.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'planes',
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/plan');
        }
    } catch (e) {
        console.error(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/plan');
    }
}

exports.planDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM planes WHERE idplan = ?', [id])
        
        let accion = 'Se borró un plan.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'planes'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/plan');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/plan');
    }
}

exports.getPublishPage = async (req, res) => {
    const result = await pool.query('SELECT * FROM emprendimientos, publicaciones, categorias WHERE emprendimientos.idcategoria = categorias.idcategoria AND emprendimientos.idemprendimiento = publicaciones.idemprendimiento');
    res.render('admin/sections/publish/index', {
        section: 'Administración emprendimientos',
        result
    })
}

exports.getPublishUpdate = async (req, res) => {
    const { id } = req.params;
    const rest = await pool.query('SELECT * FROM emprendimientos, publicaciones, usuarios WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND usuarios.idusuario = emprendimientos.idusuario AND emprendimientos.idemprendimiento = ?', [id]);
    const result = rest[0];
    res.render('admin/sections/publish/action', {
        section: 'Modificar emprendimiento',
        result
    })
}

exports.postPublishUpdate = async (req, res) => {
    const { 
        emprendimiento,
        telefono,
        correo, 
        delivery, 
        redesSociales, 
        urlRedesSociales, 
        direccion, 
        coordenadas, 
        sitioWeb, 
        nombreUrl, 
        id,
        uid } = req.body;
    
    const newUser = {
        telefono,
        correo
    }
    const newPublish = {
        emprendimiento,
        delivery,
        redesSociales,
        urlRedesSociales,
        direccion,
        coordenadas,
        sitioWeb,
        nombreUrl
    }
    const errors = [];
    try {
        if (emprendimiento.lenght <= 0 || 
            telefono.lenght <= 0 || 
            correo.lenght <= 0 || 
            redesSociales.lenght <= 0 ||
            urlRedesSociales.lenght <= 0 ||
            direccion.lenght <= 0) {
                errors.push('Los campos son requeridos para continuar');
            }
        if (errors > 0) {
            const rest = await pool.query('SELECT * FROM emprendimientos, publicaciones, usuarios WHERE emprendimientos.idemprendimiento = publicaciones.idemprendimiento AND usuarios.idusuario = emprendimientos.idusuario AND emprendimientos.idemprendimiento = ?', [id]);
            const result = rest[0];
            res.render('admin/sections/publish/upd', {
                section: 'Modificar emprendimiento',
                result
            })
        }
        await pool.query('UPDATE emprendimientos SET ? WHERE idemprendimiento = ?', [newPublish, id])
        await pool.query('UPDATE usuarios SET ? WHERE idusuario = ?', [newUser, uid])
        
        let accion = 'Se actualizó un emprendimiento.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'emprendimientos publicaciones fotos'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/publish');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/publish');   
    }
}

exports.getPublishView = async (req, res) => {
    const { id } = req.params;
    const rows_e = await pool.query('SELECT * FROM emprendimientos WHERE idemprendimiento = ?', [id]);
    const results = rows_e[0].idemprendimiento;
    const rows_p = await pool.query('SELECT * FROM publicaciones WHERE idemprendimiento = ?', [results]);
    const results2 = rows_p[0].idpublicacion
    const idplan = rows_p[0].idplan;
    const idusuario = rows_e[0].idusuario
    const user = await pool.query('SELECT * FROM usuarios WHERE idusuario = ?', [idusuario])
    const photos = await pool.query('SELECT * FROM fotos WHERE idpublicacion = ?', [results2]);
    const title = rows_e[0].emprendimiento;
    const rows_c = await pool.query('SELECT * FROM ciudades, estados WHERE ciudades.idciudad = ? AND ciudades.idestado = estados.idestado', [rows_e[0].idciudad]);
    const rows_plan = await pool.query('SELECT * FROM planes WHERE idplan = ?', [idplan]);
    const plan = rows_plan[0].nombre
    const categories = await pool.query('SELECT * FROM categorias');
    console.log(rows_c)
    res.render('admin/sections/publish/view', {
        section: 'Visualizando',
        title,
        rows_e,
        rows_p,
        user,
        plan,
        rows_c,
        photos,
        results,
        categories      
    })
}

exports.postPublishBlock = async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM publicaciones WHERE idemprendimiento = ?', [id]);
    const publish = rows[0];
    if (parseInt(publish.status) == 1) {
        try {
            await pool.query('UPDATE publicaciones SET status = 0 WHERE idemprendimiento = ?', [id]);
            
            let accion = 'Se cambió el estado de una publicación.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'publicaciones'
            }
            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);

            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/publish');
        } catch (e) {
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/admin/publish');
            console.log(e)
        }
    }
    if (parseInt(publish.status) == 0) {
        try {
            const result = await pool.query('UPDATE publicaciones SET status = 1 WHERE idemprendimiento = ?', [id]);
            let accion = 'Se cambió el estado de una publicación.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'publicaciones'
            }
            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);

            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/publish');
        } catch (e) {
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/admin/publish');
            console.log(e)
        }
    }
}

exports.postPublishTop = async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM publicaciones WHERE idemprendimiento = ?', [id]);
    const publish = rows[0];
    if (parseInt(publish.top) == 1) {
        try {
            await pool.query('UPDATE publicaciones SET top = 0 WHERE idemprendimiento = ?', [id]);
            
            let accion = 'Se activó el top de una publicación.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'publicaciones'
            }
            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);

            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/publish');
        } catch (e) {
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/admin/publish');
            console.log(e)
        }
    }
    if (parseInt(publish.top) == 0) {
        try {
            const result = await pool.query('UPDATE publicaciones SET top = 1 WHERE idemprendimiento = ?', [id]);
            let accion = 'Se desactivó el top de una publicación.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'publicaciones'
            }
            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);

            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/publish');
        } catch (e) {
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/admin/publish');
            console.log(e)
        }
    }
}

exports.getCategoryPage = async (req, res) => {
    const categories = await pool.query('SELECT * FROM categorias');
    res.render('admin/sections/category/index', {
        section: 'Administración de categorías',
        categories
    })
}

exports.getCategoryCreate = async (req, res) => {
    const categories = await pool.query('SELECT * FROM categorias');
    res.render('admin/sections/category/action', {
        section: 'Agregar nueva categoría',
        categories
    })
}

exports.getCategoryUpdate = async (req, res) => {
    const { id } = req.params;
    const type = await pool.query('SELECT idcategoria, nombre FROM categorias');
    const rest = await pool.query('SELECT * FROM categorias AS rows WHERE idcategoria = ?', [id]);
    const result = rest[0]
    res.render('admin/sections/category/action', {
        section: 'Modificar categoría',
        result,
        type
    })
}

exports.getSubcategoryUpdate = async (req, res) => {
    const { id } = req.params;
    const type = await pool.query('SELECT idcategoria, nombre FROM categorias');
    const rest = await pool.query('SELECT * FROM categorias AS rows WHERE idcategoria = ?', [id]);
    const result = rest[0]
    res.render('admin/sections/category/action_sub', {
        section: 'Modificar categoría',
        result,
        type
    })
}

exports.postCategoryCreate = async (req, res) => {
    const { idpadre, nombre, color } = req.body;
    const image = req.file;
    const errors = [];
    try {
        if (nombre.lenght <= 0 || color.lenght <= 0 || image.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar');
        }
        if (errors.lenght > 0) {
            const categories = await pool.query('SELECT * FROM categorias');
            res.render('admin/sections/category/action', {
                nombre,
                color,
                idpadre,
                categories,
                errors
            })
        } else {
            const dir = '/img/category/';
            const newCategory = {
                idpadre,
                nombre,
                color,
                imagen: dir + image.filename
            };
            await pool.query('INSERT INTO categorias SET ?', [newCategory]);
            
            let accion = 'Se agregó una nueva categoría o subcategoría.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'categorias'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/category');
            }
        } catch (e) {
            console.log(e);
            req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
            res.redirect('/admin/category');
        }
}

exports.postCategoryUpdate = async (req, res) => {
    const { idpadre, nombre, color, id } = req.body;
    const image = req.file;

    const errors = [];
    try {
        if (nombre.lenght <= 0 || color.lenght <= 0) {
            errors.push('Todos los campos son necesario para continuar');
        }
        if (errors > 0) {
            res.render('admin/sections/category/action', {
                id,
                idpadre,
                color,
                imagen,
                errors
            })
        } else {
            if (!image) {
                const newCategory = {
                    idpadre,
                    nombre,
                    color
                }

                await pool.query('UPDATE categorias SET ? WHERE idcategoria = ?', [newCategory, id]);
            } else {
                const dir = '/img/category/'
                const newCategory = {
                    idpadre,
                    nombre,
                    color,
                    imagen: dir + image.filename
                };
                await pool.query('UPDATE categorias SET ? WHERE idcategoria = ?', [newCategory, id]);
            }
            
            
            let accion = 'Se actualizó una categoría o subcategoría.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'categorias'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/category');
            }
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/category');
    }
}

exports.postSubcategoryUpdate = async (req, res) => {
    const { idpadre, nombre, id } = req.body;
    const errors = [];
    console.log(idpadre, nombre, id);
    try {
        if (nombre.lenght <= 0) {
            errors.push('Todos los campos son necesario para continuar');
        }
        if (errors > 0) {
            res.render('admin/sections/category/action', {
                id,
                idpadre,
                errors
            })
        } else {
            const newCategory = {
                idpadre,
                nombre,
            };
            await pool.query('UPDATE categorias SET ? WHERE idcategoria = ?', [newCategory, id]);
            
            let accion = 'Se actualizó una categoría o subcategoría.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'categorias'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/category');
            }
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        //res.redirect('/admin/category');
        res.send('ok')
    }
}

exports.categoryDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM categorias WHERE idcategoria = ?', [id])
        
        let accion = 'Se borró una categoría o subcategoría.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'categorias'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/category');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/category');
    }
}

exports.getSitePage = async (req, res) => {
    const site = await pool.query('SELECT * FROM sitio WHERE idsitio = 1');
    res.render('admin/sections/site/index', {
        section: 'Administración del sitio',
        site
    })
}

exports.getSiteCreate = async (req, res) => {
    res.render('admin/sections/site/action', {
        section: 'Agregar información del sitio'
    })
}

exports.getSiteUpdate = async (req, res) => {
    const { id } = req.params;
    const rest = await pool.query('SELECT * FROM sitio WHERE idsitio = ?', [id]);
    const result = rest[0]
    res.render('admin/sections/site/action', {
        section: 'Modificar información del sitio',
        result
    })
}

exports.postSiteCreate = async (req, res) => {
    const { direccion, telefono, correo, facebook, instagram, twitter, whatsapp, telegram } = req.body;
    const errors = [];
    const newSite = {
        idsitio: 1,
        direccion,
        telefono,
        correo,
        facebook,
        instagram,
        twitter,
        telegram,
        whatsapp
    }
    try {
        if (direccion.lenght <= 0 || 
            telefono.lenght <= 0 || 
            correo.lenght <= 0 || 
            facebook.lenght <= 0 ||
            instagram.lenght <= 0 ||
            twitter.lenght <= 0 ||
            telegram.lenght <= 0 ||
            whatsapp.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar.');
        }
            
        if (errors.lenght > 0) {
            res.render('admin/sections/site/action', {
                section: 'Agregar información del sitio',
                direccion,
                telefono,
                correo,
                facebook,
                instagram,
                telegram,
                twitter,
                whatsapp,
                errors
            })
            } else {
                await pool.query('INSERT INTO sitio SET ?', [newSite]);
                
                let accion = 'Se Agrego información del sitio.';
                const newAction = {
                    accion
                };

                await pool.query('INSERT INTO acciones SET ?', [newAction]);
                const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
                
                const idaccion = rows[0].idaccion;

                const newAuditory = {
                    idadministrador: req.user.id,
                    idaccion,
                    tabla: 'sitio'
                };

                await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
                req.flash('success', 'Se ha realizado el proceso con éxito.');
                res.redirect('/admin/site');
            }
    } catch (e) {
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        console.log(e)
        res.redirect('/admin/site');
    }
}

exports.postSiteUpdate = async (req, res) => {
    const { direccion, telefono, correo, facebook, instagram, twitter, whatsapp, telegram, id } = req.body;
    const newSite = {
        direccion,
        telefono,
        correo,
        facebook,
        instagram,
        twitter,
        telegram,
        whatsapp
    };
    const errors = [];
    try {
        if (direccion.lenght <= 0 || 
            telefono.lenght <= 0 || 
            correo.lenght <= 0 || 
            facebook.lenght <= 0 ||
            instagram.lenght <= 0 ||
            twitter.lenght <= 0 || 
            telegram.lenght <= 0 ||
            whatsapp.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar');
        }
        if (errors.lenght > 0) {
            const rest = pool.query('SELECT * FROM sitio WHERE idsitio = ?', [id]);
            const result = rest[0]
            res.render('admin/sections/site/action', {
                section: 'Agregar información del sitio',
                errors,
                result,
            })
            } else {
                await pool.query('UPDATE sitio SET ? WHERE idsitio = ?', [newSite, id]);

                let accion = 'Se actualizó la información del sitio.';
                const newAction = {
                    accion
                };

                await pool.query('INSERT INTO acciones SET ?', [newAction]);
                const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
                
                const idaccion = rows[0].idaccion;

                const newAuditory = {
                    idadministrador: req.user.id,
                    idaccion,
                    tabla: 'sitio'
                };

                await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
                req.flash('success', 'Se ha realizado el proceso con éxito.');
                res.redirect('/admin/site');
            }
    } catch (e) {
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/site');
    }
}

exports.getCarouselPage = async (req, res) => {
    const carousels = await pool.query('SELECT * FROM carrusel');
    res.render('admin/sections/carousel/index', {
        section: 'Carruseles',
        carousels
    })
}

exports.getCarouselCreate = async (req, res) => {
    res.render('admin/sections/carousel/action', {
        section: 'Agregar imagen al carrusel',
    })
}

exports.postCarouselCreate = async (req, res) => {
    const dir = '/img/slide/main/';
    const errors = [];
    const image = req.file;
    const newCarousel = {
        nombre: image.originalname,
        imagen: dir + image.filename,
        status: 1,
        created_at: Date.now
    };
    
    try {
        if (image.lenght <= 0) {
        errors.push('Debe seleccionar una imagen para poder continuar')
        }
        if (errors > 0) {
            res.render('admin/sections/carousel/action', {
                section: 'Agregar imagen al carrusel',
                errors
            })
        } else {
            let accion = 'Se agregó una imagen del carrusel.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'carrusel'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            await pool.query('INSERT INTO carrusel SET ?', [newCarousel]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/carousel');
        }
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/carousel');
    }
}

exports.carouselDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM carrusel WHERE idcarrusel = ?', [id])

        let accion = 'Se borró una imagen del carrusel.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'carrusel'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/carousel');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/carousel');
    }
}

exports.getStatePage = async (req, res) => {
    const states = await pool.query('SELECT * FROM estados');
    res.render('admin/sections/state/index', {
        section: 'Administración de estados',
        states
    })
}

exports.getStateCreate = async (req, res) => {
    res.render('admin/sections/state/action', {
        section: 'Agregar estado'
    })
}

exports.getStateUpdate = async (req, res) => {
    const { id } = req.params;
    const rest = await pool.query('SELECT * FROM estados WHERE idestado = ?', [id]);
    const result = rest[0]
    res.render('admin/sections/state/action', {
        section: 'Modificar estado',
        result
    })
}

exports.postStateCreate = async (req, res) => {
    const { estado } = req.body;
    const errors = [];
    const newState = {
        estado
    };
    try {
        if (estado.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar.');
        }
        if (errors > 0) {
            res.render('admin/sections/state/add', {
                section: 'Agregar estado',
                estado,
                errors
            })    
        } else {
            await pool.query('INSERT INTO estados SET ?', [newState]);
            
            let accion = 'Se agregó un nuevo estado.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'estados'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);;
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/state');
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.')
        res.redirect('/admin/state')
    }
}

exports.postStateUpdate = async (req, res) => {
    const { estado, id } = req.body;
    const newState = {
        estado
    };
    try {
        await pool.query('UPDATE estados SET ? WHERE idestado = ?', [newState, id]);
        
        let accion = 'Se actualizó un estado.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'estados'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');  
        res.redirect('/admin/state');     
    } catch (e) {
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.')
        res.redirect('/admin/state');
    }
}

exports.stateDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estados WHERE idestado = ?', [id])
        
        let accion = 'Se borró un estado.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'estados'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/state');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/state');
    }
}

exports.getCityPage = async (req, res) => {
    const cities = await pool.query('SELECT * FROM ciudades, estados WHERE ciudades.idestado = estados.idestado');
    res.render('admin/sections/city/index', {
        section: 'Administración de ciudades',
        cities
    })
}

exports.getCityCreate = async (req, res) => {
    const states = await pool.query('SELECT * FROM estados');
    res.render('admin/sections/city/action', {
        section: 'Agregar ciudad',
        states
    })
}

exports.getCityUpdate = async (req, res) => {
    const { id } = req.params;
    const rest = await pool.query('SELECT * FROM ciudades WHERE idciudad = ?', [id])
    const states = await pool.query('SELECT * FROM estados')
    const result = rest[0]
    res.render('admin/sections/city/action', {
        section: 'Modificar ciudad',
        result,
        states
        
    })
}

exports.postCityCreate = async (req, res) => {
    const { idestado, ciudad } = req.body;
    const errors = [];
    const newCity = {
        idestado,
        ciudad
    };
    try {
        if (ciudad.lenght <= 0 || idestado.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar');
        }
        if (errors.lenght > 0) {
            res.render('admin/sections/city/action', {
                section: 'Agregar ciudad',
                idestado,
                errors
            })
        } else {
            await pool.query('INSERT INTO ciudades SET ?', [newCity]);

            let accion = 'Se agregó una ciudad nueva.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'ciudades'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha agregado la ciudad con éxito.');
            res.redirect('/admin/city');
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar la agregación, intentelo nuevamente.');
        res.redirect('/admin/city');
    }
}

exports.postCityUpdate = async (req, res) => {
    const { id, ciudad, idestado} = req.body;
    const newCity = {
        ciudad,
        idestado
    };
    try {
        await pool.query('UPDATE ciudades SET ? WHERE idciudad = ?', [newCity, id]);
        
        let accion = 'Se actualizó una ciudad.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'ciudades'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/city');
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.')
        res.redirect('/admin/city');
    }
}

exports.cityDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ciudades WHERE idciudad = ?', [id])
        
        let accion = 'Se borró una ciudad.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'ciudades'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/city');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/city');
    }
}

exports.getAllyPage = async (req, res) => {
    const allies = await pool.query('SELECT * FROM aliados');
    res.render('admin/sections/ally/index', {
        section: 'Administración de Aliados',
        allies
    })
}

exports.getAllyView = async (req, res) => {
    const { id } = req.params
    const rest = await pool.query('SELECT * FROM aliados WHERE idaliado = ?', [id])
    const result = rest[0];
    res.render('admin/sections/ally/view', {
        section: 'Visualizando: ' + result.nombre,
        result
    })
}

exports.getAllyCreate = async (req, res) => {
    res.render('admin/sections/ally/action', {
        section: 'Agregar nuevo aliado'
    })
}

exports.getAllyUpdate = async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM aliados WHERE idaliado = ?', [id]);
    const result = rows[0];
    res.render('admin/sections/ally/action', {
        section: 'Actualizar aliado: ' + result.nombre,
        result
    })
}

exports.postAllyCreate = async (req, res) => {
    const { nombre, correo } = req.body
    const errors = [];
    try {
        if (nombre.lenght <= 0 || correo.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar');
        }
        if (errors > 0) {
            res.render('admin/sections/ally/action', {
                nombre,
                correo,
                logo,
                errors
            })
        } else {
            const dir = '/img/slide/ally/'
            const newAlly = {
                nombre,
                correo,
                logo: dir + req.file.originalname
            }
            await pool.query('INSERT INTO aliados SET ?', [newAlly]);
            
            let accion = 'Se agregó un nuevo aliado.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
            
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'aliados'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/ally');
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/ally');
    }
}

exports.postAllyUpdate = async (req, res) => {
    const { nombre, correo, id } = req.body
    const logo = req.file;
    const errors = [];
    try {
        if (nombre.lenght <= 0 || correo.lenght <= 0 || logo.lenght <= 0) {
            errors.push('Todos los campos son necesarios para continuar');
        }
        if (errors > 0) {
            res.render('admin/sections/ally/action', {
                nombre,
                correo,
                logo,
                errors
            })
        } else {
            const dir = '/img/slide/ally/'
            const newAlly = {
                nombre,
                correo,
                logo: dir + req.file.originalname
            }
            await pool.query('UPDATE aliados SET ? WHERE idaliado = ?', [newAlly, id]);
        
            let accion = 'Se agregó un nuevo aliado.';
            const newAction = {
                accion
            };

            await pool.query('INSERT INTO acciones SET ?', [newAction]);
            const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
            const idaccion = rows[0].idaccion;

            const newAuditory = {
                idadministrador: req.user.id,
                idaccion,
                tabla: 'aliados'
            };

            await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
            req.flash('success', 'Se ha realizado el proceso con éxito.');
            res.redirect('/admin/ally');
        }
    } catch (e) {
        console.log(e);
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/ally');
    }
}

exports.allyDelete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM aliados WHERE idaliado = ?', [id])
        
        let accion = 'Se borró un aliado.';
        const newAction = {
            accion
        };

        await pool.query('INSERT INTO acciones SET ?', [newAction]);
        const rows = await pool.query('SELECT idaccion FROM acciones WHERE accion = ?', [accion]);
        
        const idaccion = rows[0].idaccion;

        const newAuditory = {
            idadministrador: req.user.id,
            idaccion,
            tabla: 'aliados'
        };

        await pool.query('INSERT INTO auditorias SET ?', [newAuditory]);
        req.flash('success', 'Se ha realizado el proceso con éxito.');
        res.redirect('/admin/ally');
    } catch (e) {
        console.log(e)
        req.flash('danger', 'No se ha podido realizar el proceso, intentelo nuevamente.');
        res.redirect('/admin/ally');
    }
}