const prisma = require('../prisma/prisma')
const SubcriptionUtils = require('../utils/subscriptionUtils')
const catchAsync = require('../utils/catchAsync')
const subscriptionUtil=new SubcriptionUtils()

exports.create = catchAsync(async (req, res) => {
    const data = req.body

    //Check if data exist
    if(!data){
        return res.status(400).json({
            status: 'No data provided'
        })
    }

    //Create Subcription
    const result = await prisma.subscription.create({
        data: data
    })
    if (!result) {
        return res.status(400).json({
            status: 'Create subscription failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Create subscription success!!!',
            subscription:result
        })
    }
})

exports.delete=catchAsync(async (req,res)=>{
    const id=req.query.id
    if(!id){
        return res.status(400).json({
            status: 'No id provided'
        })
    }

    //Check if subscription exist
    const subscription=await subscriptionUtil.findByID(parseInt(id))
    if(!subscription){
        return res.status(400).json({
            status: 'No subscription found'
        })
    }

    //Delete Subcription
    const result=await prisma.subscription.delete({
        where:{
            id:parseInt(id)
        }
    })
    if (!result) {
        return res.status(400).json({
            status: 'Delete subscription failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Delete subscription success!!!'
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

    //Check if subscription exist
    const subscription=await subscriptionUtil.findByID(parseInt(data.id))
    if(!subscription){
        return res.status(400).json({
            status: 'No subscription found'
        })
    }

    //Update subscription
    const result=await prisma.subscription.update({
        where:{
            id:parseInt(data.id)
        },
        data:data
    })
    if (!result) {
        return res.status(400).json({
            status: 'Update subscription failed!!!'
        })
    } else {
        return res.status(200).json({
            status: 'Update subscription success!!!',
            subscription:result
        })
    }
})

exports.findAll=catchAsync(async (req,res)=>{
    const query=req.query
    const length=await subscriptionUtil.count()
    var subscriptions

    if(!query.limit||!query.offset){
        subscriptions=await prisma.subscription.findMany()
    }else{
        subscriptions=await prisma.subscription.findMany({
            take:parseInt(query.limit),
            skip:parseInt(query.offset),
        })
    }

    if (!subscriptions) {
        return res.status(400).json({
            status: 'No subscriptions found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Find all subscription success !!!',
            subscriptions,
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

    const subscription=await prisma.subscription.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    if (!subscription) {
        return res.status(400).json({
            status: 'No subscription found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Subcription search successful',
            subscription
        })
    }
})

exports.findByAccountID=catchAsync(async (req,res)=>{
    const id=req.query.id
    if(!id){
        return res.status(400).json({
            status: 'No id provided !!!'
        })
    }

    const account=await prisma.account.findUnique({
        where:{
            id:parseInt(id)
        },
        include:{
            Subscription:true
        }
    })

    const subscription=account.Subscription

    if (!subscription) {
        return res.status(400).json({
            status: 'No subscription found !!!'
        })
    } else {
        return res.status(200).json({
            status: 'Subcription search successful',
            subscription
        })
    }
})
