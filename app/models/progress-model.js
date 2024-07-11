const mongoose = require('mongoose')
const { Schema, model } = mongoose

const progressSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        default: 0
    },
    chest: {
        type: Number,
        default: 0
    },
    waist: {
        type: Number,
        default: 0
    },
    hips: {
        type: Number,
        default: 0
    },
    thigh: {
        type: Number,
        default: 0
    },
    bicep: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Progress = model('Progress', progressSchema)

module.exports = Progress