const Answer = require('../models/answer-model')
const Client = require('../models/client-model')
const Question = require('../models/question-model')
const { validationResult } = require('express-validator')

const answerCtrl = {}

answerCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = {
            question: req.body.question,
            answer: req.body.answer,
            client: req.user.id
        }
        const question = await Question.findById(req.body.question)
        const client = await Client.findOne({ user: req.user.id })
        if (!question || !client) {
            return res.status(404).json({ errors: "Question or Client not found" })
        }
        if (!question.isDefault && question.coach.toString() !== client.coach.toString()) {
            return res.status(404).json({ errors: "Not Authorized to Create Answer" })
        }
        const answerExists = await Answer.findOne({
            question: req.body.question,
            client: req.user.id
        })
        if (answerExists) {
            return res.status(404).json({ errors: "You have already answered this question" })
        }
        const answer = new Answer(body)
        await answer.save()
        return res.status(201).json(answer)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}
//todo combine get method
answerCtrl.getMyAnswer = async (req, res) => {
    try {
        const answer = await Answer.find({ client: req.user.id }).populate('question client')
        return res.status(201).json(answer)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

answerCtrl.getClientAnswer = async (req, res) => {
    try {
        const answer = await Answer.find({ client: req.params.clientId }).populate('question client')
        return res.status(201).json(answer)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

answerCtrl.update = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const answer = await Answer.findById(req.params._id)
        if (!answer) {
            return res.status(404).json({ errors: "answer not found" })
        }
        if (req.user.id.toString() !== answer.client._id.toString()) {
            return res.status(404).json({ errors: "you are not authorized to update" })
        }
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params._id, { answer: req.body.answer }, { new: true })
        res.status(201).json(updatedAnswer)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

answerCtrl.delete = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const answer = await Answer.findById(req.params._id)
        if (!answer) {
            return res.status(404).json({ errors: "answer not found" })
        }
        if (req.user.id.toString() !== answer.client._id.toString()) {
            return res.status(404).json({ errors: "you are not authorized to update" })
        }
        const deletedAnswer = await Answer.findByIdAndDelete(req.params._id)
        res.status(201).json(deletedAnswer)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = answerCtrl