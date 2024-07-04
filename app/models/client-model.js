const mongoose = require('mongoose')
const { Schema, model } = mongoose

const ClientSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    phoneNumber: Number,
    dateOfBirth: Date,
    gender : String,
    weight : Number,
    height  : Number,
}, {timestamps: true})

const Client = model('Client', ClientSchema)

module.exports = Client