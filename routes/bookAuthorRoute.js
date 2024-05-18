const express = require('express')
const router = express.Router()
const bookAuthorController = require('../controllers/bookAuthorController')

//Get
router.get('/authorName', bookAuthorController.findByAuthorName)
router.get('/id', bookAuthorController.findByID)
router.get('/', bookAuthorController.findAll)
router.get('/bookName', bookAuthorController.findByBookName)

//Update
router.put('/', bookAuthorController.update)

//Create
router.post('/', bookAuthorController.create)

//Delete
router.delete('/', bookAuthorController.delete)


module.exports = router
