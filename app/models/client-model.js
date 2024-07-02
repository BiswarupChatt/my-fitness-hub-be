const mongoose = require('mongoose')
const { Schema, model } = mongoose

const ClientSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNumber: Number,
    dateOfBirth: Number,
    gender : String,
    weight : Number,
    height  : Number,
}, {timestamps: true})

const Client = model('client', ClientSchema)

module.exports = Client