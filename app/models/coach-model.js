const mongoose = require('mongoose')
const {Schema, model} = mongoose


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
    dateOfBirth: Number, 
    gender: String,
    weight: Number, 
    height: Number, 
    bankDetails: {
        accName: { type: String, default: '' },
        accNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' }
    }
})

const Coach = model('coach', coachSchema)

module.exports = Coach