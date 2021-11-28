const app = require('express').Router()
const AdminController = require('../controllers/AdminController')
const fs = require('fs')

const multer = require('multer')
const path = require('path')
/**
 * Categorias
 */
const storageCategories = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = path.join(__dirname, '../public/img/category')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) return err;
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
  })
  
    const fileFilter = (req, file, cb) => {
        const allowedFileExt = ['image/jpeg', 'image/jpg', 'image/png']
        if(allowedFileExt.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

const upload_categories = multer({ storage: storageCategories, fileFilter })

/**
 * Publicaciones - Fotos
 */
 const storagePublish = multer.diskStorage({
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

const upload_publish = multer({ storage: storagePublish, fileFilter })

const uploads_photos = upload_publish.array('images', 6)


const upload_photo = upload_publish.single('image')
/**
 * Slide
 */
const storageSlide = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = path.join(__dirname, '../public/img/slide/main')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) return err;
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
  })
const upload_slide = multer({ storage: storageSlide, fileFilter })

/**
 * ALiados
 */
const storageAlly = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = path.join(__dirname, '../public/img/slide/ally')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) return err;
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
  })
const upload_ally = multer({ storage: storageAlly, fileFilter })
// #end
/**
 * Home
 */
app.get('/', AdminController.getAdminPage)

/**
 * Notify
 */

app.get('/notify', AdminController.getNotifyPage)

/**
 * Panel
 */

app.get('/panel', AdminController.getPanelPage)

app.get('/panel/view/:id', AdminController.getPanelView)

app.post('/panel/enable', AdminController.postChangeEnablePanel)

app.post('/panel/disable', AdminController.postChangeDisablePanel)

/**
 * Users
 */

app.get('/user', AdminController.getUserPage)

app.get('/user/create', AdminController.getUserCreate)

app.get('/user/upd/:id', AdminController.getUserUpdate)

app.delete('/user/delete/:id', AdminController.userDelete)

app.post('/user/add', AdminController.postUserCreate)

app.post('/user/upd', AdminController.postUserUpdate)

/**
 * Plans
 */

app.get('/plan', AdminController.getPlanPage)

app.get('/plan/upd/:id', AdminController.getPlanUpdate)

app.get('/plan/add', AdminController.getPlanCreate)

app.post('/plan/add', AdminController.postPlanCreate)

app.post('/plan/upd/', AdminController.postPlanUpdate)

app.delete('/plan/delete/:id', AdminController.planDelete)

/**
 * Publish
 */

app.get('/publish', AdminController.getPublishPage)

app.get('/publish/upd/:id', AdminController.getPublishUpdate)

app.get('/publish/view/:id', AdminController.getPublishView)

app.post('/publish/upd/logo', upload_photo, AdminController.postPublishUpdateLogo)

app.post('/publish/upd', AdminController.postPublishUpdate)

app.post('/publish/upd/photos', uploads_photos, AdminController.postPublishUpdateImagesAll)

app.post('/publish/upd/photo', upload_photo, AdminController.postPublishUpdateImageUni)

app.post('/publish/block/:id', AdminController.postPublishBlock)

app.post('/publish/top/:id', AdminController.postPublishTop)

/**
 * Category
 */

app.get('/category', AdminController.getCategoryPage)

app.get('/category/add', AdminController.getCategoryCreate)

app.get('/category/upd/:id', AdminController.getCategoryUpdate)

app.get('/subcategory/upd/:id', AdminController.getSubcategoryUpdate)

app.post('/category/add', upload_categories.single('image'), AdminController.postCategoryCreate)

app.post('/category/upd', upload_categories.single('image'), AdminController.postCategoryUpdate)

app.post('/subcategory/upd', AdminController.postSubcategoryUpdate)

app.delete('/category/delete/:id', AdminController.categoryDelete)

/**
 * Site
 */

app.get('/site', AdminController.getSitePage)

app.get('/site/upd/:id', AdminController.getSiteUpdate)

app.get('/site/add', AdminController.getSiteCreate)

app.post('/site/add', AdminController.postSiteCreate)

app.post('/site/upd', AdminController.postSiteUpdate)

/**
 * Carousel
 */

app.get('/carousel', AdminController.getCarouselPage)

app.get('/carousel/add/', AdminController.getCarouselCreate)

app.delete('/carousel/delete/:id', AdminController.carouselDelete)

app.post('/carousel/add/', upload_slide.single('image'), AdminController.postCarouselCreate)

/**
 * State
 */

app.get('/state', AdminController.getStatePage)

app.get('/state/upd/:id', AdminController.getStateUpdate)

app.get('/state/add', AdminController.getStateCreate)

app.post('/state/upd', AdminController.postStateUpdate)

app.post('/state/add', AdminController.postStateCreate)

app.delete('/state/delete/:id', AdminController.stateDelete)

/**
 * City
 */

app.get('/city', AdminController.getCityPage)

app.get('/city/upd/:id', AdminController.getCityUpdate)

app.get('/city/add', AdminController.getCityCreate)

app.post('/city/add', AdminController.postCityCreate)

app.post('/city/upd', AdminController.postCityUpdate)

app.delete('/city/delete/:id', AdminController.cityDelete)

/**
 * Ally
 */

app.get('/ally', AdminController.getAllyPage)

app.get('/ally/view/:id', AdminController.getAllyView)

app.get('/ally/add', AdminController.getAllyCreate)

app.get('/ally/upd/:id', AdminController.getAllyUpdate)

app.post('/ally/add', upload_ally.single('logo'), AdminController.postAllyCreate)

app.post('/ally/upd/', upload_ally.single('logo'), AdminController.postAllyUpdate)

app.delete('/ally/delete/:id', AdminController.allyDelete)

module.exports = app;