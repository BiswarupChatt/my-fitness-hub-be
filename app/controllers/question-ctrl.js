const Question = require('../models/question-model')
const { validationResult } = require('express-validator')

const questionCtrl = {}

questionCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let isDefault

        if (req.user.role === "admin") {
            isDefault = true
        } else if (req.user.role === "coach") {
            isDefault = false
        } else {
            isDefault = false
        }

        const body = {
            title: req.body.title,
            coach: req.user.id,
            isDefault: isDefault
        }
        const question = new Question(body)
        await question.save()
        res.status(201).json(question)
    }
    catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = questionCtrl