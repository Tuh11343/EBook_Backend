const prisma = require('../prisma/prisma')
const BookUtils = require('../utils/bookUtils')
const catchAsync = require('../utils/catchAsync')
const bookUtil = new BookUtils()

exports.findAll = catchAsync(async (req, res) => {
    const orderBy = req.query.orderBy ?? 'id'
    const query = req.query

    if (!query) {
        return res.status(400).json({
            status: 'No query found',
        })
    }

    var books
    var length = await bookUtil.count()
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            orderBy: {
                [orderBy]: 'asc'
            }
        })
    } else {
        books = await prisma.book.findMany({
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            orderBy: {
                [orderBy]: 'asc'
            }
        })
    }
    if (!books) {
        return res.status(400).json({
            status: 'No books found',
        })
    } else {
        return res.status(200).json({
            status: 'Books search successful',
            books,
            length
        })
    }
})

exports.findByID = catchAsync(async (req, res) => {
    const id = req.query.id

    //Get ID param
    if (!id) {
        return res.status(400).json({
            status: 'No id provided',
        })
    }

    //Find Book
    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!book) {
        return res.status(400).json({
            status: 'No book found',
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            book
        })
    }
})

exports.findByName = catchAsync(async (req, res) => {
    const query = req.query

    if (!query.name) {
        return res.status(400).json({
            status: 'No name provided'
        })
    }

    const orderBy = query.orderBy ?? 'id'
    const length = await bookUtil.countByname(query.name)
    var books
    if (!query.offset || !query.limit) {
        books = await prisma.book.findMany({
            where: {
                OR: [{
                    name: {
                        contains: query.name
                    }
                }, {
                    bookAuthor: {
                        some: {
                            author: {
                                name: {
                                    contains: query.name
                                }
                            }
                        }
                    }
                }
                ]
            },
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookAuthor: true,
            }
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                OR: [{
                    name: {
                        contains: query.name
                    }
                }, {
                    bookAuthor: {
                        some: {
                            author: {
                                name: {
                                    contains: query.name
                                }
                            }
                        }
                    }
                }
                ]
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookAuthor: true,
            }
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No books found'
        })
    } else {
        return res.status(200).json({
            status: 'Books search successful',
            books,
            length
        })
    }

})

exports.findByGenreList = catchAsync(async (req, res) => {
    const query = req.query
    // const list = query.genreList.split(",")
    // if (!list) {
    //     return res.status(400).json({
    //         status: 'No genreList provided'
    //     })
    // }
    // var genreList = list.map(str => parseInt(str, 10));

    // const orderBy = query.orderBy ?? 'id'
    // const length = await bookUtil.countByGenreList(genreList)
    // var books
    // if (!query.limit || !query.offset) {
    //     books = await prisma.book.findMany({
    //         where: {
    //             bookGenres: {
    //                 every: {
    //                     genre: {
    //                         id: {
    //                             in: genreList
    //                         }
    //                     }
    //                 },
    //             }
    //         },
    //         orderBy: {
    //             [orderBy]: 'asc'
    //         },
    //         include: {
    //             bookGenres: true
    //         }
    //     })
    // } else {
    //     books = await prisma.book.findMany({
    //         where: {
    //             bookGenres: {
    //                 every: {
    //                     genre: {
    //                         id: {
    //                             in: genreList
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         take: parseInt(query.limit),
    //         skip: parseInt(query.offset),
    //         orderBy: {
    //             [orderBy]: 'asc'
    //         },
    //         include: {
    //             bookGenres: true
    //         }
    //     })
    // }

    // if (!books) {
    //     return res.status(400).json({
    //         status: 'No book found',
    //     })
    // } else {
    //     return res.status(200).json({
    //         status: 'Books search successful',
    //         books,
    //         length

    //     })
    // }
    // SELECT DISTINCT b.*
    // FROM Book b
    // JOIN book_genre bg ON b.id = bg.book_id
    // JOIN Genre g ON bg.genre_id = g.id
    // WHERE g.id IN (3,7)
    // GROUP BY b.id
    // HAVING COUNT(DISTINCT g.id) = 2;

    const books = await prisma.$queryRaw`
    SELECT DISTINCT b.*
    FROM Book b
    JOIN book_genre bg ON b.id = bg.book_id
    JOIN Genre g ON bg.genre_id = g.id
    WHERE g.id IN (${query.genreList})
    GROUP BY b.id
    HAVING COUNT(DISTINCT g.id) = ${2}`


    return res.status(200).json({
        books
    })

})

exports.findByGenreID = catchAsync(async (req, res) => {

    const query = req.query
    if (!query.id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const orderBy = query.orderBy ?? 'id'
    const length = await bookUtil.countByGenre(query.id)
    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                bookGenres: {
                    some: {
                        genre_id: parseInt(query.id)
                    }
                }
            },
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookGenres: true
            }
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                bookGenres: {
                    some: {
                        genre_id: parseInt(query.id)
                    }
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookGenres: true
            }
        })
    }


    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'success',
            books,
            length
        })
    }
})

exports.findByAuthorID = catchAsync(async (req, res) => {
    const query = req.query

    if (!query.id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const orderBy = query.orderBy ?? 'id'
    const length = await bookUtil.countByAuthor(query.id)
    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                bookAuthor: {
                    some: {
                        author_id: parseInt(query.id)
                    }
                }
            },
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookAuthor: true
            }
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                bookAuthor: {
                    some: {
                        author_id: parseInt(query.id)
                    }
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            orderBy: {
                [orderBy]: 'asc'
            },
            include: {
                bookAuthor: true
            }
        })
    }


    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length
        })
    }
})

exports.findByFavorite = catchAsync(async (req, res) => {
    const query = req.query

    if (!query.id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                bookFavorite:{
                    some:{
                        user_id:parseInt(query.id)
                    }
                }
            },
            include: {
                bookFavorite:true
            }
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                bookFavorite:{
                    some:{
                        user_id:parseInt(query.id)
                    }
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            include: {
                bookFavorite:true
            }
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length:books.length
        })
    }
})

exports.findByNameAndGenre = catchAsync(async (req, res) => {
    const query = req.query

    if (!query) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const length = await bookUtil.countByNameAndGenre(query.name,parseInt(query.genre_id))
    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                bookGenres: {
                    some: {
                        genre_id: parseInt(query.genre_id)
                    }
                },
                name:{
                    contains:query.name
                }
            },
            include: {
                bookGenres: true
            }
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                bookGenres: {
                    some: {
                        genre_id: parseInt(query.genre_id)
                    }
                },
                name:{
                    contains:query.name
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
            include: {
                bookGenres: true
            }
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length
        })
    }
})

exports.findByName = catchAsync(async (req, res) => {
    const query = req.query

    if (!query) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    var length=await bookUtil.countByname(query.name)
    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                name:{
                    contains:query.name
                }
            },
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                name:{
                    contains:query.name
                }
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length
        })
    }
})

exports.findNormalBook = catchAsync(async (req, res) => {
    const query = req.query

    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                book_type:'NORMAL'
            },
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                book_type:'NORMAL'
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length:books.length
        })
    }
})

exports.findPremiumBook = catchAsync(async (req, res) => {
    const query = req.query

    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            where: {
                book_type:'PREMIUM'
            },
        })
    } else {
        books = await prisma.book.findMany({
            where: {
                book_type:'PREMIUM'
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length:books.length
        })
    }
})

exports.findTopRating = catchAsync(async (req, res) => {
    const query = req.query

    var books
    if (!query.limit || !query.offset) {
        books = await prisma.book.findMany({
            orderBy:{
                rating:'desc'
            }
        })
    } else {
        books = await prisma.book.findMany({
            orderBy:{
                rating:'desc'
            },
            take: parseInt(query.limit),
            skip: parseInt(query.offset),
        })
    }

    if (!books) {
        return res.status(400).json({
            status: 'No book found'
        })
    } else {
        return res.status(200).json({
            status: 'Book search successful',
            books,
            length:books.length
        })
    }
})

exports.deleteByID = catchAsync(async (req, res) => {
    const query = req.query
    if (!query.id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const book = await bookUtil.findByID(parseInt(query.id))
    if (!book) {
        return res.status(400).json({
            status: 'No book found'
        })
    }

    const result = await prisma.book.delete({
        where: {
            id: parseInt(query.id)
        }
    })
    if (result) {
        return res.status(200).json({
            status: 'Book delete successful !!!',
        })
    } else {
        return res.status(400).json({
            status: 'Book delete failed !!!'
        })
    }

})

exports.updateByID = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const book = await bookUtil.findByID(parseInt(data.id))
    if (!book) {
        return res.status(400).json({
            status: 'No book found'
        })
    }

    const result = await prisma.book.update({
        where: {
            id: parseInt(data.id)
        },
        data: {
            name: data.name,
            description: data.description ?? book.description ?? null,
            rating: data.rating ?? book.rating ?? 0,
            progress: data.progress ?? book.progress ?? 0,
            published_year: data.published_year,
            image: data.image ?? data.image ?? null,
            language: data.language ?? data.language ?? null,
            book_type: data.book_type ?? book_type ?? 'NORMAL',
        }
    })
    if (result) {
        return res.status(200).json({
            status: 'Book update successful',
        })
    } else {
        return res.status(400).json({
            status: 'Book update failed',
        })
    }
})

exports.create = catchAsync(async (req, res) => {
    const data = req.body
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    const result = await prisma.book.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            rating: data.rating ?? 0,
            progress: data.progress ?? 0,
            published_year: data.published_year,
            image: data.image ?? null,
            language: data.language ?? "Unknown",
            book_type: data.book_type ?? 'NORMAL',
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create book successful'
        })
    } else {
        return res.status(200).json({
            status: 'Create book failed'
        })
    }
})
