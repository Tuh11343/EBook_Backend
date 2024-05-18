const express = require('express')
const router = express.Router()
const genreController = require('../controllers/genreController')

// router.use(authMiddleware.protect)

//Get
router.get('/name', genreController.findByName)
router.get('/', genreController.findAll)
router.get('/id', genreController.findByID)
router.get('/bookID',genreController.findByBookID)

//Update
router.put('/', genreController.update)

//Create
router.post('/', genreController.create)

//Delete
router.delete('/', genreController.delete)


module.exports = router
