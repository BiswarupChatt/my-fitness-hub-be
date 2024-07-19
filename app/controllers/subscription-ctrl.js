const Subscription = require('../models/subscription-model')
const crypto = require('crypto')
const Razorpay = require('razorpay')
const subscriptionCtrl = {}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

subscriptionCtrl.createOrder = async (req, res) => {
    const { amount, plan } = req.body
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
            user: req.user.id,
            plan: plan
        }
    }

    try {
        const order = await razorpayInstance.orders.create(options)
        const subscriptionData = {
            coach: req.user.id,
            paymentId: '',
            orderId: order.id,
            amount: amount,
            currency: "INR",
            status: 'pending'
        }
        const subscription = new Subscription(subscriptionData)
        await subscription.save()
        res.status(201).json({ order: order, subscription: subscription })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

subscriptionCtrl.verifyOrder = async (req, res) => {
    const { order_id, payment_id, signature, subscriptionId, coachId } = req.body
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY).update(`${order_id}|${payment_id}`).digest('hex')
    if (generatedSignature === signature) {
        await Subscription.findOneAndUpdate({orderId: order_id}, {
            paymentId: payment_id,
            status: 'success',
        })
        res.json({ status: 'success' })
    } else {
        await Subscription.findByIdAndUpdate(subscriptionId, { status: 'failed' });
        res.status(400).send('Invalid signature')
    }
}

module.exports = subscriptionCtrl