const e = require('express')
const prisma = require('../prisma/prisma')
const AuthorUtils = require('../utils/authorUtils')
const catchAsync = require('../utils/catchAsync')
const authorUtil=new AuthorUtils()


exports.create = catchAsync(async (req, res) => {
    const data = req.body

    //Check if data exist
    if(!data){
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    //Create Author
    const result = await prisma.author.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            image: data.image ?? null,
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create account failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Create account success!!!'
        })
    }
})

exports.delete=catchAsync(async (req,res)=>{

    //Check if id exist
    const id=req.query.id
    if(!id){
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    //Check if author exist
    const author=await authorUtil.findByID(parseInt(id))
    if(!author){
        return res.status(400).json({
            status: 'No author found'
        })
    }

    //Delete Author
    const result=await prisma.author.delete({
        where:{
            id:parseInt(id)
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Delete author failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Delete author success!!!'
        })
    }
})

exports.update=catchAsync(async (req,res)=>{
    const data=req.body

    //Check if data exist
    if(!data){
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    //Check if author exist
    const author=await authorUtil.findByID(parseInt(data.id))
    if(!author){
        return res.status(400).json({
            status: 'No author found'
        })
    }

    //Update author
    const result=await prisma.author.update({
        where:{
            id:parseInt(data.id)
        },
        data:{
            name:data.name,
            description:data.description ?? author.description ?? null,
            image:data.image ?? author.image ?? null,
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Update author failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Update author success!!!'
        })
    }
})

exports.findAll=catchAsync(async (req,res)=>{

    const query=req.query
    var authors
    var length=await authorUtil.count()
    if(!query.limit||!query.offset){
        authors=await prisma.author.findMany()
    }else{
        authors=await prisma.author.findMany({
            take:parseInt(query.limit),
            skip:parseInt(query.offset)
        })
    }

    if (!authors) {
        return res.status(400).json({
            status: 'No authors found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Find all author success !!!',
            authors,
            length
        })
    }
})

exports.findByID=catchAsync(async (req,res)=>{
    const id=req.query.id
    if(!id){
        return res.status(400).json({
            status: 'No id provided !!!'
        })
    }

    const author=await prisma.author.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    if (!author) {
        return res.status(400).json({
            status: 'No author found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Author search successful',
            author
        })
    }
})

exports.findByName=catchAsync(async (req,res)=>{
    const name=req.query.name
    if(!name){
        return res.status(400).json({
            status: 'No name provided'
        })
    }

    var authors
    var length=await authorUtil.countByName(name)
    if(!query.limit||!query.offset){
        authors=await prisma.author.findMany({
            where:{
                name:{
                    contains:name
                }
            }
        })
    }else{
        authors=await prisma.author.findMany({
            where:{
                name:{
                    contains:name
                }
            },
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
        })
    }

    if (!authors) {
        return res.status(400).json({
            status: 'No authors found'
        })
    } else {
        return res.status(200).json({
            status: 'Authors search successful',
            authors,
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

    const bookAuthors = await prisma.bookAuthor.findMany({
        where: {
            book_id:parseInt(id)
        },
        include:{
            author:true,
        }
    })


    if (!bookAuthors) {
        return res.status(400).json({
            status: 'No author found'
        })
    } else {

        const authors = bookAuthors.map(bookAuthor=>bookAuthor.author);

        return res.status(200).json({
            status: 'Author search successful',
            authors
        })
    }
})

exports.findBookAuthor = catchAsync(async (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    const book = await prisma.book.findUnique({
        where: {
            id:parseInt(id),
        },
        include:{
            bookAuthor:true,
        }
    })
    if(book.bookAuthor.length==0){
        return res.status(200).json({
            status: 'Author search successful',
            author: 'Không rõ'
        })
    }else{
        const author=await prisma.author.findFirst({
            where:{
                id:parseInt(book.bookAuthor[0].author_id)
            }
        })

        if (!author) {
            return res.status(400).json({
                status: 'No author found',
                author: 'Không rõ'
            })
        } else {
            return res.status(200).json({
                status: 'Author search successful',
                author:author.name
            })
        }
    }


})
