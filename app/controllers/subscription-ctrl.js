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
            //todo need modification in userId
            // userId: req.user.id,
            userId: '6686c25a24c5ecd12b7e5c4b',
            plan: plan
        }
    }

    try {
        const order = await razorpayInstance.orders.create(options)
        const subscriptionData = {
            //todo need modification in userId
            // coach: req.user.id,
            coach: '6686c25a24c5ecd12b7e5c4b',
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
    const { order_id, payment_id, signature, subscriptionId, userId, status } = req.body
    try {

        if (status === 'failed') {
            await Subscription.findOneAndUpdate({ orderId: order_id }, { status: 'failed' });
            return res.status(400).send('Payment failed or dismissed by user')
        }

        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY).update(order_id + '|' + payment_id).digest('hex')
        console.log("generatedSignature called", generatedSignature)
        if (generatedSignature === signature) {
            await Subscription.findOneAndUpdate({ orderId: order_id }, {
                paymentId: payment_id,
                status: 'success',
            })
            res.json({ status: 'success' })
            //todo need to manage error more precisely 
            //todo INCOMPLETE, need to add logic to update coach payment details
        } else {
            await Subscription.findOneAndUpdate({ orderId: order_id }, { status: 'failed' });
            res.status(400).send('Invalid signature')
        }
    } catch (err) {
        console.error('Error verifying order:', error)
        res.status(500).send('Internal Server Error')
    }
}

subscriptionCtrl.get = async (req, res) => {
    try {
        const subscription = await Subscription.find({ coach: req.user.id }).populate('coach')
        res.status(201).json(subscription)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong.' })
    }
}

module.exports = subscriptionCtrl