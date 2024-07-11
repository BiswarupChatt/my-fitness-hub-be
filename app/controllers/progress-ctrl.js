const Progress = require('../models/progress-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')

progressCtrl = {}

progressCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const progressData = {
            client: req.user.id,
            date: req.body.date,
            weight: req.body.weight,
            chest: req.body.chest,
            waist: req.body.waist,
            hips: req.body.hips,
            thigh: req.body.thigh,
            bicep: req.body.bicep
        }
        const findClient = await Client.findOne({ user: req.user.id })
        if (!findClient) {
            return res.status(400).json({ errors: "Client doesn't exists" })
        }
        const progress = new Progress(progressData)
        await progress.save()
        res.status(201).json(progress)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

progressCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach') {
            client = req.params.clientId
        } else {
            client = req.user.id
        }
        const findProgress = await Progress.find({ client: client }).populate('client')
        res.status(201).json(findProgress)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

progressCtrl.update = async (req, res) => {
    try {
        const progressData = {
            date: req.body.date,
            weight: req.body.weight,
            chest: req.body.chest,
            waist: req.body.waist,
            hips: req.body.hips,
            thigh: req.body.thigh,
            bicep: req.body.bicep
        }

        const findProgress = await Progress.findById(req.params._id)

        if (findProgress.client._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update progress" })
        }

        const updatedProgress = await Progress.findByIdAndUpdate(req.params._id, progressData, { new: true })
        if (!updatedProgress) {
            return res.status(404).json({ errors: "Progress record not found" })
        }

        res.status(201).json(updatedProgress)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}
module.exports = progressCtrl