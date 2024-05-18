const express=require('express')
const router=express.Router()
const favoriteController=require('../controllers/favoriteController')

// router.use(authMiddleware.protect)

//Get
router.get('/bothID',favoriteController.findByBothID)

//Delete
router.delete('/',favoriteController.delete)

//Update
router.put('/',favoriteController.update)

//Create
router.post('/',favoriteController.create)
router.post('/favoriteClick',favoriteController.favoriteClick)

module.exports=router
