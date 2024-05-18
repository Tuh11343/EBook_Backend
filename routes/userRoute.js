const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()
// router.use(authMiddleware.protect)

router.get('/', userController.getAllUsers)
router.get('/accountID',userController.getByAccountID)
router.get('/id', userController.getUserById)
router.get('/get-name/:name', userController.findUserByName)
router.delete('/', userController.deleteUserById)
router.put('/', userController.updateUserById)
router.post('/',userController.create)

module.exports = router
