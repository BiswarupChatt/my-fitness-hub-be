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
    dateOfBirth: Date, 
    gender: String,
    weight: Number, 
    height: Number, 
    bankDetails: {
        accName:  String,
        accNumber: String,
        ifscCode:  String
    }
})

const Coach = model('coach', coachSchema)

module.exports = Coach