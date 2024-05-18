const prisma = require('../prisma/prisma')
const SubscriptionHistoryUtils = require('../utils/subscriptionHistoryUtils')
const catchAsync = require('../utils/catchAsync')
const subscriptionHistoryUtil = new SubscriptionHistoryUtils()

exports.create = catchAsync(async (req, res) => {
    const data = req.body

    //Check if data exist
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    //Create SubcriptionHistory
    const result = await prisma.subscriptionHistory.create({
        data: {
            name: data.name,
            price: data.price,
            start: new Date(data.start).toISOString(),
            end: new Date(data.end).toISOString(),
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create subscriptionHistory failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Create subscriptionHistory success!!!',
            subscriptionHistory:result
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

    const subscriptionHistory = await subscriptionHistoryUtil.findByID(parseInt(id))
    if (!subscriptionHistory) {
        return res.status(400).json({
            status: 'No subscriptionHistory found'
        })
    }

    const result = await prisma.subscriptionHistory.delete({
        where: {
            id: parseInt(id)
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Delete subscriptionHistory failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Delete subscriptionHistory success!!!'
        })
    }
})

exports.update = catchAsync(async (req, res) => {
    const data = req.body

    //Check if data exist
    if (!data) {
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    //Check if subscriptionHistory exist
    const subscriptionHistory = await subscriptionHistoryUtil.findByID(parseInt(data.id))
    if (!subscriptionHistory) {
        return res.status(400).json({
            status: 'No subscriptionHistory found'
        })
    }

    //Update subscriptionHistory
    const result = await prisma.subscriptionHistory.update({
        where: {
            id: parseInt(data.id)
        },
        data: {
            name: data.name ?? subscriptionHistory.name,
            price: data.price ?? subscriptionHistory.price,
            start: new Date(data.start).toISOString(),
            end: new Date(data.end).toISOString(),
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Update subscriptionHistory failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Update subscriptionHistory success!!!',
            subscriptionHistory:result
        })
    }
})

exports.findAll = catchAsync(async (req, res) => {
    const query=req.query
    var subcriptionHistories
    const length=await subscriptionHistoryUtil.count()

    if(!query.limit||!query.offset){
        subcriptionHistories = await prisma.subscriptionHistory.findMany()
    }else{
        subcriptionHistories = await prisma.subscriptionHistory.findMany({
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
        })
    }

    if (!subcriptionHistories) {
        return res.status(400).json({
            status: 'No subcriptionHistories found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Find all subcriptionHistories success !!!',
            subcriptionHistories,
            length
        })
    }
})

exports.findByID = catchAsync(async (req, res) => {
    const id=req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided !!!'
        })
    }

    const subscriptionHistory = await prisma.subscriptionHistory.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!subscriptionHistory) {
        return res.status(400).json({
            status: 'No subscriptionHistory found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'SubcriptionHistory search successful',
            subscriptionHistory
        })
    }
})

exports.findBySubscriptionID = catchAsync(async (req, res) => {
    const id=req.query.id
    if (!id) {
        return res.status(400).json({
            status: 'No id provided !!!'
        })
    }

    const subscription = await prisma.subscription.findUnique({
        where: {
            id: parseInt(id)
        },
        include:{
            subcription_history:true
        }
    })
    if (!subscription) {
        return res.status(400).json({
            status: 'No subscriptionHistory found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'SubcriptionHistory search successful',
            subscriptionHistory:subscription.subcription_history
        })
    }
})
