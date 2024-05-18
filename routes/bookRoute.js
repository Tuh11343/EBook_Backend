const express=require('express')
const router=express.Router()
const bookController=require('../controllers/bookController')

// router.use(authMiddleware.protect)

//Get
router.get('/',bookController.findAll)
router.get('/id',bookController.findByID)
router.get('/name',bookController.findByName)
router.get('/genre',bookController.findByGenreID)
router.get('/author',bookController.findByAuthorID)
router.get('/genreList',bookController.findByGenreList)
router.get('/favorite',bookController.findByFavorite)
router.get('/nameAndGenre',bookController.findByNameAndGenre)
router.get('/name',bookController.findByName)
router.get('/normal',bookController.findNormalBook)
router.get('/premium',bookController.findPremiumBook)
router.get('/topRating',bookController.findTopRating)

//Delete
router.delete('/',bookController.deleteByID)

//Update
router.put('/',bookController.updateByID)

//Create
router.post('/',bookController.create)

module.exports=router
