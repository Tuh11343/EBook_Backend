const e = require('express')
const prisma = require('../prisma/prisma')
const catchAsync = require('../utils/catchAsync')
const GenreUtil = require('../utils/genreUtils')

const genreUtil = new GenreUtil()

exports.create = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const result = await prisma.genre.create({
        data: {
            name: data.name,
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create genres failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Create genres successful !!!'
        })
    }
})

exports.delete = catchAsync(async (req, res) => {
    const { id } = req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const genre = await genreUtil.findByID(parseInt(id))
    if (!genre) {
        return res.status(400).json({
            status: 'No genre found'
        })
    }

    const result = await prisma.genre.delete({
        where: {
            id: parseInt(id)
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Delete genre failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Delete genre successful !!!'
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

    const genre = await genreUtil.findByID(parseInt(data.id))
    if (!genre) {
        return res.status(400).json({
            status: 'No genre found'
        })
    }

    const result = await prisma.genre.update({
        where: {
            id: parseInt(data.id)
        },
        data: {
            name: data.name,
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Update genre failed !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Update genre successful !!!'
        })
    }
})

exports.findAll = catchAsync(async (req, res) => {
    const query = req.query
    var genres

    if (!query.limit || !query.offset) {
        genres = await prisma.genre.findMany({})
    } else {
        genres = await prisma.genre.findMany({
            take: parseInt(query.limit),
            skip: parseInt(query.offset)
        })
    }

    const length = await genreUtil.count()

    if (!genres) {
        return res.status(400).json({
            status: 'No genres found'
        })
    } else {
        return res.status(200).json({
            status: 'Genres search successful',
            genres,
            length
        })
    }
})

exports.findByID = catchAsync(async (req, res) => {
    const { id } = req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const genre = await prisma.genre.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!genre) {
        return res.status(400).json({
            status: 'No genre found'
        })
    } else {
        return res.status(200).json({
            status: 'Genre search successful',
            genre
        })
    }
})

exports.findByName = catchAsync(async (req, res) => {
    const query=req.query

    if (!query.name) {
        return res.status(400).json({
            status: 'No name provided'
        })
    }

    var genres
    const length = await genreUtil.countWithName(query.name)

    if(!query.limit||!query.offset){
        genres=await prisma.genre.findMany({
            where: {
                name: {
                    contains: query.name
                }
            },
        })
    }else{
        genres = await prisma.genre.findMany({
            where: {
                name: {
                    contains: query.name
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
        })
    }


    if (!genres) {
        return res.status(400).json({
            status: 'No genres found'
        })
    } else {
        return res.status(200).json({
            status: 'Genres search successful',
            genres,
            length
        })
    }
})

exports.findByBookID = catchAsync(async (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const bookGenres = await prisma.bookGenre.findMany({
        where: {
            book_id:parseInt(id)
        },
        include:{
            book:true,
            genre:true
        }
    })


    if (!bookGenres) {
        return res.status(400).json({
            status: 'No genre found'
        })
    } else {

        const genres = bookGenres.map(bookGenre=>bookGenre.genre);

        return res.status(200).json({
            status: 'Genre search successful',
            genres
        })
    }
})
