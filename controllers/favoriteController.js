const prisma = require('../prisma/prisma')
const FavoriteUtils = require('../utils/favoriteUtils')
const catchAsync = require('../utils/catchAsync')
const favoriteUtil = new FavoriteUtils()


exports.create = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const result = await prisma.favorite.create({
        data: data
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create favorite failed'
        })
    } else {
        return res.status(200).json({
            status: 'Create favorite successful',
            favorite:result
        })
    }
  })

exports.update = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const favorite = await favoriteUtil.findByID(data.id)
    if (!favorite) {
        return res.status(400).json({
            status: 'No favorite found'
        })
    }

    const result = await prisma.favorite.update({
        where: {
            id: parseInt(data.id)
        },
        data:data
    })
    if (result) {
        return res.status(200).json({
            status: 'Favorite update successful',
            favorite:result
        })
    } else {
        return res.status(400).json({
            status: 'Favorite update failed',
        })
    }
  })

exports.delete = catchAsync(async (req, res) => {
    const query = req.query
    if (!query.id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const favorite = await favoriteUtil.findByID(parseInt(query.id))
    if (!favorite) {
        return res.status(400).json({
            status: 'No favorite found'
        })
    }

    const result = await prisma.favorite.delete({
        where: {
            id: parseInt(query.id)
        }
    })
    if (result) {
        return res.status(200).json({
            status: 'Favorite delete successful !!!',
            favorite:result
        })
    } else {
        return res.status(400).json({
            status: 'Book delete failed !!!'
        })
    }

})


exports.findByBothID = catchAsync(async (req, res) => {
    const query = req.query

    if (!query) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    var favorite=await prisma.favorite.findUnique({
        where:{
            user_id:parseInt(query.user_id),
            book_id:parseInt(query.book_id),
        }
    })

    if (!favorite) {
        return res.status(400).json({
            status: 'No favorite found'
        })
    } else {
        return res.status(200).json({
            status: 'Favorite search successful',
            favorite
        })
    }
})

exports.favoriteClick = catchAsync(async (req, res) => {
    const query = req.query

    if (!query) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    var favorite=await prisma.favorite.findFirst({
        where:{
            user_id:parseInt(query.user_id),
            book_id:parseInt(query.book_id),
        }
    })

    if (!favorite) {

        var favoriteCreate=await prisma.favorite.create({
            data:{
                user_id:parseInt(query.user_id),
                book_id:parseInt(query.book_id),
            }
        })
        return res.status(200).json({
            status: 'Create favorite',
            action: true,
            favoriteCreate
        })

    } else {
        var favoriteDelete=await prisma.favorite.delete({
            where:{
                id:favorite.id
            }
        })
        return res.status(200).json({
            status: 'Delete favorite',
            favoriteDelete,
            action:false,
        })
    }
})
