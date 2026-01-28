const { store, index, trash, update } = require('../controllers/productController')
const upload = require('../middleware/upload')
const { upload: cloudinaryUpload, uploadToCloudinary } = require('../middleware/cloudinaryUpload')
const { verifyUser } = require('../middleware/verify')

const router = require('express').Router()

router
    .route('/')
    .post(cloudinaryUpload.single('image'), uploadToCloudinary, store)
    .get(index)

router
    .route('/:id')
    .delete(verifyUser, trash)
    .put(cloudinaryUpload.single('image'), uploadToCloudinary, update)

    

module.exports = router
