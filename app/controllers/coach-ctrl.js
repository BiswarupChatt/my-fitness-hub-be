const Coach = require('../models/coach-model')
const User = require('../models/user-model')
const _ = require('lodash')
const { validationResult } = require('express-validator')

const coachCtrl = {}

coachCtrl.get = async (req, res) => {
    try {
        const coach = await Coach.find({ user: req.user.id }).populate("user", )
        return res.status(200).json(coach)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong" })
    }
}

coachCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = _.pick(req.body, ['phoneNumber', 'dateOfBirth', 'gender', 'weight', 'height', 'bankDetails'])
        const coach = await Coach.findOneAndUpdate({ user: req.user.id }, body, { new: true })
        res.status(201).json(coach)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

coachCtrl.verification = async (req, res) => {
    try {
        const body = _.pick(req.body, ['isVerified', 'user'])
        const coach = await Coach.findOneAndUpdate({ user: body.user }, body, { new: true })
        res.status(201).json(coach)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = coachCtrl