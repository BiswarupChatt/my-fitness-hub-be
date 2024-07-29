const mongoose = require('mongoose')
const { Schema, model } = mongoose

const clientSchema = new Schema({
    user: {
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
    gender: String,
    firstName: String,
    lastName: String,
    email: String,
    weight: Number,
    height: Number,
    program: {
        programName: {
            type: Schema.Types.ObjectId,
            ref: "Program",
        },
        startDate: Date,
        endDate: Date,
        isActive: Boolean
    },
}, { timestamps: true })

const Client = model('Client', clientSchema)

module.exports = Client