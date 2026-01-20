const { index, store, trash, update } = require('../controllers/categoryController')

const router = require('express').Router()

// console.log("CATEGORY ROUTE LOADED");

router
.route('/')
.get(index)
.post(store)

router
.route('/:id')
.delete(trash)
.put(update)


module.exports = router