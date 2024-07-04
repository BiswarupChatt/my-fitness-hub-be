const Coach = require('../models/coach-model')
const _ = require('lodash')
const { validationResult } = require('express-validator')
const Client = require('../models/client-model')

const coachCtrl = {}

coachCtrl.getMy = async (req, res) => {
    try {
        const coach = await Coach.find({ user: req.user.id }).populate("user")
        return res.status(200).json(coach)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

coachCtrl.getAllCLient = async (req, res) => {
    try {
        const client = await Client.find({ coach: req.user.id }).populate("coach", "_id firstName lastName email role").populate("user", "_id firstName lastName email role")
        return res.status(201).json(client)
    } catch (err) {
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