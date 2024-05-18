const express = require('express')
const router = express.Router()
const bookGenreController = require('../controllers/bookGenreController')

// const authMiddleware = require('../middlewares/authMiddleware')
// router.use(authMiddleware.protect)

//Get
router.get('/genresName', bookGenreController.findByGenreName)
router.get('/id', bookGenreController.findByID)
router.get('/', bookGenreController.findAll)
router.get('/bookName', bookGenreController.findByBookName)

//Update
router.put('/', bookGenreController.update)

//Create
router.post('/', bookGenreController.create)

//Delete
router.delete('/', bookGenreController.delete)


module.exports = router
