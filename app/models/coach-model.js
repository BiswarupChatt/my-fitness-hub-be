const mongoose = require('mongoose')
const { Schema, model } = mongoose
// const User = require('./user-model')


const coachSchema = new Schema({
    isVerified: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNumber: Number,
    dateOfBirth: Date,
    gender: String,
    weight: Number,
    height: Number,
    payment: {
        plan: {
            type: String,
            enum: ['monthly', 'yearly'],
        },
        isActive: {
            type: Boolean,
            default: false
        },
        startDate: Date,
        endDate: Date,
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: 'Subscription'
        }
    }
}, { timestamps: true })

const Coach = model('Coach', coachSchema)

module.exports = Coach