const mongoose = require('mongoose')
const { Schema, model } = mongoose

const progressSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: Date,
    weight: Number,
    chest: Number,
    waist: Number,
    hips: Number,
    thigh: Number,
    bicep: Number
}, { timestamps: true })

const Progress = model('Progress', progressSchema)

module.exports = Progress