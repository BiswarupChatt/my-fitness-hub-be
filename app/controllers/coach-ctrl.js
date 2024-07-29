const coachCtrl = {}
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const Coach = require('../models/coach-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const { sendInvitationEmail } = require('../utility/nodeMailer')

coachCtrl.getMy = async (req, res) => {
    try {
        const coach = await Coach.findOne({ user: req.user.id }).populate("user")
        return res.status(200).json(coach)
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
        const body = _.pick(req.body, ['phoneNumber', 'dateOfBirth', 'gender', 'weight', 'height', 'bankDetails', 'firstName', 'lastName', 'email'])
        const coach = await Coach.findOneAndUpdate({ user: req.user.id }, body, { new: true })
        const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
        res.status(201).json({coach, user})
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong.", err })
    }
}

coachCtrl.getAllCLient = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', search = '' } = req.query

        const searchQuery = {
            coach: req.user.id,
            $or: [
                // { user: { $regex: search, $options: 'i' } },
                // { gender: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
            ]
        }

        const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

        const client = await Client
            .find(searchQuery)
            // .populate("coach user")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        // const client = await Client.find({ coach: req.user.id }).populate("coach", "_id firstName lastName email role").populate("user", "_id firstName lastName email role")
        return res.status(201).json(client)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong.", err })
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

coachCtrl.sendInvitationEmail = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        const coachDetails = await User.findById(req.user.id)
        if (user) {
            return res.status(400).json({ errors: "User already exists" })
        }
        const token = jwt.sign({ coachId: req.user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SEND_INVITATION_EXPIRE })

        sendInvitationEmail(email, token, coachDetails.firstName, coachDetails.lastName)

        return res.status(200).json({ message: "Email Sent Successfully", token: token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong." })
    }
}

coachCtrl.getSingleCLient = async (req, res) => {
    try {
        const client = await Client.findOne({ user: req.params.userId }).populate("coach", "_id firstName lastName email role").populate("user", "_id firstName lastName email role")
        if (req.user.id === client.coach._id) {
            return res.status(201).json(client)
        } else {
            res.status(404).json({ errors: "You're not authorized to see the details" })
        }
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = coachCtrl