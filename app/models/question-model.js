const mongoose = require('mongoose')
const { Schema, model } = mongoose

const questionSchema = new Schema({
    title: String,
    isDefault: {
        type: Boolean,
        default: false,
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Question = model("Question", questionSchema)

module.exports = Question