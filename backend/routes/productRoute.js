const { store, index, trash, update } = require('../controllers/productController')
const upload = require('../middleware/upload')



const router = require('express').Router()

router
    .route('/')
    .post(upload.single('p_image'), store)
    .get(index)

router
    .route('/:id')
    .delete(trash)
    .put(upload.single('p_image'), update)

    

module.exports = router
