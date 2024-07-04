const mongoose = require('mongoose')
const {Schema, model} = mongoose
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
    bankDetails: {
        accName:  String,
        accNumber: String,
        ifscCode:  String
    }
})

const Coach = model('Coach', coachSchema)

module.exports = Coach