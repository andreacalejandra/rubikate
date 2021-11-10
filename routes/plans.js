// initialization router
const app = require('express').Router();

const PlansController = require('../controllers/PlansController')


const multer = require('multer');
const path = require('path');
const fs = require('fs')
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
/**
 * Routes
 */
app.get('/', PlansController.getPlansPage);

app.get('/needed/register/:idplan', PlansController.getRegister);

app.post('/registered', uploads, PlansController.postRegistered)

app.post('/register', uploads, PlansController.postRegister)

app.get('/register/done', PlansController.getDone)

module.exports = app;