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
        ref: "User",
        required: true
    },
    phoneNumber: Number,
    dateOfBirth: Date,
    gender: String,
    firstName: String,
    lastName: String,
    email: String,
    weight: Number,
    height: Number,
    payment: {
        plan: {
            type: String,
            enum: ['monthly', 'yearly'],
            default: 'monthly'
        },
        isActive: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    }
}, { timestamps: true })

const Coach = model('Coach', coachSchema)

module.exports = Coach