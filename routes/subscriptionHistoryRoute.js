const express = require('express')
const router = express.Router()
const subscriptionHistoryController = require('../controllers/subscriptionHistoryController')

// const authMiddleware = require('../middlewares/authMiddleware')
// router.use(authMiddleware.protect)

//Get
router.get('/', subscriptionHistoryController.findAll)
router.get('/id', subscriptionHistoryController.findByID)

//Update
router.put('/', subscriptionHistoryController.update)

//Create
router.post('/', subscriptionHistoryController.create)

//Delete
router.delete('/', subscriptionHistoryController.delete)


module.exports = router
