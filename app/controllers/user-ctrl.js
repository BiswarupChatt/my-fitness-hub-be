const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { welcomeEmail, forgetPasswordMail } = require('../utility/nodeMailer')
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
        const userRole = "coach"
        const user = new User({ ...body, password: hashPassword, role: userRole })
        await user.save()

        const newUser = await User.findOne({ email: req.body.email })
        if (newUser) {
            welcomeEmail(newUser.email)
        } else {
            return res.status(400).json({ errors: 'New user not found' })
        }
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LOGIN_EXPIRE })
                return res.status(200).json({ token })
            } else {
                return res.status(500).json({ errors: 'Invalid Credentials' })
            }
        } else {
            return res.status(500).json({ errors: 'Invalid Credentials' })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.forgetPassword = async (req, res) => {
    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.status(404).json({ errors: 'Email not found' })
        } else {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_FORGET_PASS_EXPIRE })
            forgetPasswordMail(body.email, token)
        }
        return res.status(200).json({ errors : "Email Sent Successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

// userCtrl.resetPassword = async ()

module.exports = userCtrl