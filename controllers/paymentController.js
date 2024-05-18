require('dotenv').config();
const prisma = require('../prisma/prisma')
const catchAsync = require('../utils/catchAsync')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.pay=catchAsync(async (req,res)=>{

    const query=req.query
    if(!query){
      return res.status(400).json({
          status: 'No data provided'
      })
    }

    const account=await prisma.account.findUnique({
      where:{
        id:parseInt(query.accountID)
      },
      include:{
        User:true
      }
    })
    if(!account){
      return res.status(400).json({
        status: 'No account found'
    })
    }

    const customer = await stripe.customers.create({
        email:account.email,
        name:account.User.name,
      });
      const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: customer.id},
        {apiVersion: '2023-10-16'}
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat(query.total),
        currency: 'usd',
        customer: customer.id,
        description:"Thanh toán phiên bản nâng cấp sách EBook",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      });
})
