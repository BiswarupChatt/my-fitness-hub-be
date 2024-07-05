const mongoose = require('mongoose')
const { Schema, model } = mongoose

const questionSchema = new Schema({
    title: String,
    isDefault: {
        type: Boolean,
        default: false,
        required: true
    },
    coach: {
        types: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Question = model("Question", questionSchema)

module.exports = Question