const prisma = require('../prisma/prisma')
const catchAsync = require('../utils/catchAsync')
const BookGenreUtil= require('../utils/bookGenreUtils')
const bookGenreUtil=new BookGenreUtil()

exports.create = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const result = await prisma.bookGenre.create({
        data: {
            book_id: data.book_id,
            genre_id: data.genre_id
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create bookGenre failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Create bookGenre successful !!!'
        })
    }
})

exports.delete = catchAsync(async (req, res) => {
    const id=req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const bookGenre=await bookGenreUtil.findByID(parseInt(id))
    if(!bookGenre){
        return res.status(400).json({
            status: 'No bookGenre found'
        })
    }

    const result = await prisma.bookGenre.delete({
        where: {
            id: parseInt(id)
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Delete bookGenre failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Delete bookGenre successful !!!'
        })
    }
})

exports.update = catchAsync(async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }
    const bookGenre=await bookGenreUtil.findByID(body.id)
    if(!bookGenre){
        return res.status(400).json({
            status: 'No bookGenre found'
        })
    }

    const result = await prisma.bookGenre.update({
        where: {
            id: parseInt(body.id)
        },
        data: {
            book_id: body.book_id ?? book_id,
            genre_id: body.genre_id ?? genre_id
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Update bookGenre failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Update bookGenre successful !!!'
        })
    }
})

exports.findAll = catchAsync(async (req, res) => {
    const query=req.query
    var length=await bookGenreUtil.count()
    var bookGenres
    if(!query.limit||!query.offset){
        bookGenres = await prisma.bookGenre.findMany()
    }else{
        bookGenres = await prisma.bookGenre.findMany({
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
        })
    }

    if (!bookGenres) {
        return res.status(400).json({
            status: 'No bookGenres found'
        })
    } else {
        return res.status(200).json({
            status: 'BookGenres search successful',
            bookGenres,
            length
        })
    }
})

exports.findByID = catchAsync(async (req, res) => {
    const id=req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const bookGenre = await prisma.bookGenre.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!bookGenre) {
        return res.status(400).json({
            status: 'No bookGenres found'
        })
    } else {
        return res.status(200).json({
            status: 'BookGenres search successful',
            bookGenre
        })
    }
})

exports.findByGenreName = catchAsync(async (req, res) => {
    const name=req.query.name
    const query=req.query
    if (!name) {
        return res.status(400).json({
            status: 'No name provided'
        })
    }

    const length=await bookGenreUtil.countByGenreName(name)
    var bookGenres
    if(!query.limit||!query.offset){
        bookGenres = await prisma.bookGenre.findMany({
            where: {
                genre:{
                    name:{
                        contains:name
                    }
                }
            },
            include:{
                genre:true
            }
        })    
    }else{
        bookGenres = await prisma.bookGenre.findMany({
            where: {
                genre:{
                    name:{
                        contains:name
                    }
                }
            },
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
            include:{
                genre:true
            }
        })
    }
    
    if (!bookGenres) {
        return res.status(400).json({
            status: 'No bookGenres found'
        })
    } else {
        return res.status(200).json({
            status: 'BookGenres search successful',
            bookGenres,
            length
        })
    }
})

exports.findByBookName = catchAsync(async (req, res) => {
    const query=req.query
    const name=query.name
    if (!name) {
        return res.status(400).json({
            status: 'No name provided'
        })
    }

    var length=await bookGenreUtil.countByBookName(name)
    var bookGenres

    if(!query.limit||!query.offset){
        bookGenres = await prisma.bookGenres.findMany({
            where: {
                book:{
                    name:{
                        contains:name
                    }
                }
            },
            include:{
                book:true
            }
        })
    }else{
        bookGenres = await prisma.bookGenres.findMany({
            where: {
                book:{
                    name:{
                        contains:name
                    }
                }
            },
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
            include:{
                book:true
            }
        })
    }

    if (!bookGenres) {
        return res.status(400).json({
            status: 'No bookGenres found'
        })
    } else {
        return res.status(200).json({
            status: 'BookGenres search successful',
            bookGenres,
            length
        })
    }
})
