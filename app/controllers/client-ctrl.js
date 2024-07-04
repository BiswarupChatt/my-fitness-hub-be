const Client = require('../models/client-model')
const { validationResult } = require('express-validator')

const clientCtrl = {}

clientCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = _.pick(req.body, ['phoneNumber', 'dateOfBirth', 'gender', 'weight', 'height', 'bankDetails'])
        const client = await Client.findOneAndUpdate({ user: req.user.id }, body, { new: true })
        res.status(201).json(client)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = clientCtrl