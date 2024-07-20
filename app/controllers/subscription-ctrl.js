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
            //todo need modification in coachId
            // coachId: req.user.id,
            coachId: '6686c25a24c5ecd12b7e5c4b',
            plan: plan
        }
    }

    try {
        const order = await razorpayInstance.orders.create(options)
        const subscriptionData = {
            //todo need modification in coachId
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
    const { order_id, payment_id, signature, subscriptionId, coachId, status } = req.body
    try {
        if (status === 'failed') {
            try {
                const findSubscription = await Subscription.findOneAndUpdate(
                    { orderId: order_id },
                    { status: 'failed' },
                    { new: true }
                )
                if (!findSubscription) {
                    res.status(404).json({ errors: 'Subscription not found' })
                }
                return res.status(400).json({ errors: 'Payment failed or dismissed by user' })
            } catch (err) {
                res.status(500).json({ errors: 'Something went wrong.' })
            }
        }
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(order_id + '|' + payment_id)
            .digest('hex')

        if (generatedSignature === signature) {
            try {
                const findSubscription = await Subscription.findOneAndUpdate({ orderId: order_id },
                    {
                        paymentId: payment_id,
                        status: 'success',
                    }, 
                    { new: true }
                )

                if (!findSubscription) {
                    return res.status(404).json({ errors: 'Subscription not found' })
                }
 
                //todo INCOMPLETE, need to add logic to update coach payment details

                res.status(201).json({ status: 'Payment successful' })
            } catch (err) {
                res.status(500).json({ errors: 'Something went wrong.' })
            }
        } else {
            try {
                await Subscription.findOneAndUpdate(
                    { orderId: order_id },
                    { status: 'failed' },
                    { new: true })
                return res.status(400).json({ errors: 'Invalid signature' })
            } catch (err) {
                res.status(500).json({ errors: 'Something went wrong.' })
            }
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong.' })
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