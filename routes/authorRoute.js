const express = require('express')
const router = express.Router()
const authorController = require('../controllers/authorController')

// const authMiddleware = require('../middlewares/authMiddleware')
// router.use(authMiddleware.protect)

//Get
router.get('/name', authorController.findByName)
router.get('/', authorController.findAll)
router.get('/id', authorController.findByID)
router.get('/bookID',authorController.findByBookID)
router.get('/bookAuthorOne',authorController.findBookAuthor)

//Update
router.put('/', authorController.update)

//Create
router.post('/', authorController.create)

//Delete
router.delete('/', authorController.delete)


module.exports = router
