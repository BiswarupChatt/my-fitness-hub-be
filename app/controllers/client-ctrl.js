const clientCtrl = {}
const _ = require("lodash")
const Client = require('../models/client-model')
const User = require('../models/user-model')
const { validationResult } = require('express-validator')



clientCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = _.pick(req.body, ['phoneNumber', 'dateOfBirth', 'gender', 'weight', 'height', 'firstName', 'lastName', 'email'])
        const client = await Client.findOneAndUpdate({ user: req.user.id }, body, { new: true })
        const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
        res.status(201).json({ client, user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong" })
    }
}

clientCtrl.getMy = async (req, res) => {
    try {
        const client = await Client.findOne({ user: req.user.id }).populate("coach", "_id firstName lastName email role").populate("user", "_id firstName lastName email role")
        return res.status(200).json(client)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = clientCtrl