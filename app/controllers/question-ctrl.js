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

questionCtrl.getDefault = async (req, res) => {
    try {
        const question = await Question.find({ isDefault: true }).populate("coach", "_id firstName lastName email role")
        res.status(201).json(question)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

questionCtrl.get = async (req, res) => {
    try {
        const question = await Question.find({ coach: req.params.coachId }).populate("coach", "_id firstName lastName email role")
        res.status(201).json(question)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

questionCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const question = await Question.findById(req.params._id)
        if (!question) {
            return res.status(404).json({ errors: "Question not found" })
        }
        if (req.user.id.toString() !== question.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update" })
        }
        const updatedQuestion = await Question.findByIdAndUpdate(req.params._id, req.body, { new: true })
        res.status(201).json(updatedQuestion)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

questionCtrl.delete = async (req, res) => {
    try {
        const question = await Question.findById(req.params._id)
        if (!question) {
            res.status(404).json({ errors: "Question not found" })
        }
        if (req.user.id.toString() !== question.coach._id.toString()) {
            res.status(404).json({ errors: "you are not authorized to update" })
        }
        const deletedQuestion = await Question.findByIdAndDelete(req.params._id)
        res.status(201).json(deletedQuestion)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = questionCtrl