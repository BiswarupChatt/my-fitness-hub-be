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
        const userId = req.user.id
        const body = {
            question: req.body.question,
            answer: req.body.answer,
            client: req.user.id
        }
        const question = await Question.findById(req.body.question)
        const client = await Client.findOne({user: userId}).populate('user coach')
        console.log(question, client)
        // const answer = new Answer(body)
        // await answer.save()
        res.status(201).json({question : question, client: client})
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = answerCtrl