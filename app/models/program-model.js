const mongoose = require('mongoose')
const { Schema, model } = mongoose

const programSchema = new Schema({
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    programName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
})

const Program = model('Program', programSchema)
module.exports = Program