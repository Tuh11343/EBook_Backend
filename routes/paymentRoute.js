const express = require('express')
const paymentController = require('../controllers/paymentController')

const router = express.Router()

router.post("/",paymentController.pay)

module.exports=router