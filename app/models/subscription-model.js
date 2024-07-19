const mongoose = require('mongoose')
const { Schema, model } = mongoose

const subscriptionSchema = new Schema({
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'success'],
        default: 'pending'
    }
}, { timestamps: true })

const Subscription = model('Subscription', subscriptionSchema)

module.exports = Subscription