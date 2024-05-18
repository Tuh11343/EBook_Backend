const express = require('express')
const accountController = require('../controllers/accountController')

const router = express.Router()

router.get('/', accountController.getAllAccounts)
router.get('/id', accountController.getAccountById)
router.get('/email', accountController.findAccountByEmail)
router.get('/signIn',accountController.signIn)
router.delete('/', accountController.deleteAccountById)
router.put('/', accountController.updateAccountById)
router.post('/',accountController.create)
module.exports = router
