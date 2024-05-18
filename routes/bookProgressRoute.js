const express = require('express')
const bookProgressController = require('../controllers/bookProgressController')

const router = express.Router()

router.get('/', bookProgressController.getAllBookProgress)
router.get('/:id', bookProgressController.getBookProgressById)
router.get('/book-id/:id', bookProgressController.getBookProgressByBookId)
router.get('/user-id/:id', bookProgressController.getBookProgressByUserId)
router.post('/', bookProgressController.createBookProgress)
router.put('/:id', bookProgressController.updateBookProgress)
router.delete('/:id', bookProgressController.deleteBookProgress)

module.exports = router
