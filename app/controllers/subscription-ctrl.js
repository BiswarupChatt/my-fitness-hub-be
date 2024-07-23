const subscriptionCtrl = {}
const crypto = require('crypto')
const moment = require('moment')
const Razorpay = require('razorpay')
const Coach = require('../models/coach-model')
const Subscription = require('../models/subscription-model')

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

const paymentFailure = async (order_id) => {
    try {
        const findSubscription = await Subscription.findOneAndUpdate(
            { orderId: order_id },
            { status: 'failed' },
            { new: true }
        )
        if (!findSubscription) {
            return { status: 404, errors: 'Subscription not found.' }
        }
        return { status: 400, errors: 'Payment failed or dismissed by user.' }
    } catch (err) {
        return { status: 500, errors: 'Something went wrong.' }
    }
}

const generateSignature = (order_id, payment_id) => {
    return crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(order_id + '|' + payment_id)
        .digest('hex')
}

const updateSubscriptionSuccess = async (order_id, payment_id) => {
    try {
        const findSubscription = await Subscription.findOneAndUpdate(
            { orderId: order_id },
            {
                paymentId: payment_id,
                status: 'success'
            },
            { new: true }
        )
        if (!findSubscription) {
            return { status: 404, errors: 'Subscription not found.' }
        }
        return { status: 200, data: findSubscription }
    } catch (err) {
        return { status: 500, errors: 'Something went wrong.' }
    }
}

const updateCoachPaymentDetails = async (coachId, plan) => {
    try {
        const coach = await Coach.findOne({ user: coachId })
        if (!coach) {
            return { status: 404, errors: 'Coach not found.' }
        }

        let endDate
        let startDate
        const currentDate = moment()

        if (coach.payment.isActive === true) {
            startDate = moment(coach.payment.startDate)
            if (plan === 'monthly') {
                endDate = moment(coach.payment.endDate).add(1, 'month')
            } else if (plan === 'yearly') {
                endDate = moment(coach.payment.endDate).add(1, 'year')
            }
        } else {
            startDate = currentDate
            if (plan === 'monthly') {
                endDate = currentDate.clone().add(1, 'month')
            } else if (plan === 'yearly') {
                endDate = currentDate.clone().add(1, 'year')
            }
        }

        const coachModelUpdate = await Coach.findOneAndUpdate(
            { user: coachId },
            {
                'payment.isActive': true,
                'payment.startDate': startDate.toDate(),
                'payment.endDate': endDate.toDate(),
            },
            { new: true }
        )
        if (!coachModelUpdate) {
            return { status: 404, errors: "Coach not found." }
        }
        return { status: 201, data: coachModelUpdate }
    } catch (err) {
        return { status: 500, errors: 'Something went wrong.' }
    }
}

subscriptionCtrl.createOrder = async (req, res) => {
    const { amount, plan } = req.body
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt-${moment().format('YYYYMMDD-HHmmss')}-${crypto.randomBytes(3).toString('hex')}`,
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
    const { order_id, payment_id, signature, coachId, status, plan } = req.body
    try {
        if (status === 'failed') {
            const paymentResult = await paymentFailure(order_id)
            console.log("1")
            return res.status(paymentResult.status).json({ errors: paymentResult.errors })
        }

        const compareSignature = generateSignature(order_id, payment_id)
        if (compareSignature === signature) {
            const subscriptionResult = await updateSubscriptionSuccess(order_id, payment_id)
            console.log("2")
            if (subscriptionResult.status !== 200) {
                return res.status(subscriptionResult.status).json({ errors: subscriptionResult.errors })
            }

            const coachResult = await updateCoachPaymentDetails(coachId, plan)
            console.log("3")
            return res.status(coachResult.status).json(
                coachResult.status === 201 ? { status: "Payment Successful" } : { errors: coachResult.errors }
            )
        }else{
            const paymentResult = await handlePaymentFailure(order_id)
            console.log("4")
            return res.status(400).json({ errors: paymentResult.errors })
        }
    } catch (err) {
        console.log(err)
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