const mongoose = require('mongoose')
const { Schema, model } = mongoose

const answerSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    answer: String
})

const Answer = model("Answer", answerSchema)

module.exports = Answer