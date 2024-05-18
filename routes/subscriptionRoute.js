const express = require('express')
const router = express.Router()
const subscriptionController = require('../controllers/subscriptionController')

// const authMiddleware = require('../middlewares/authMiddleware')
// router.use(authMiddleware.protect)

//Get
router.get('/', subscriptionController.findAll)
router.get('/id', subscriptionController.findByID)
router.get('/accountID',subscriptionController.findByAccountID)

//Update
router.put('/', subscriptionController.update)

//Create
router.post('/', subscriptionController.create)

//Delete
router.delete('/', subscriptionController.delete)


module.exports = router
