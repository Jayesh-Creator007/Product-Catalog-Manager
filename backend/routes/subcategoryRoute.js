const { index, store, trash, update, getByCategory } = require('../controllers/subcategoryController')

const router = require('express').Router()

router
.route('/')
.get(index)
.post(store)

router
.route('/byCategory/:categoryId')
.get(getByCategory)

router
.route('/:id')
.delete(trash)
.put(update)

module.exports = router