const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')

const userCtrl = {}

userCtrl.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User({ ...body, password: hashPassword })
        await user.save()
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = userCtrl