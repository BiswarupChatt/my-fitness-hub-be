const User = require('../models/user-model')
const Client = require('../models/client-model')
const Coach = require('../models/coach-model')
const _ = require('lodash')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { welcomeEmail, forgetPasswordMail } = require('../utility/nodeMailer')
const userCtrl = {}

userCtrl.coachRegister = async (req, res) => {
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
            const coachData = {
                user: newUser._id
            }
            const coach = new Coach(coachData)
            await coach.save()
            welcomeEmail(newUser.email)
            res.status(201).json({ user: user, coach: coach })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.clientRegister = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const userRole = "client"

        const coach = await User.findById(req.params.coachId)
        if (!coach) {
            return res.status(400).json({ errors: 'Invalid coach ID' })
        }
        const user = new User({ ...body, password: hashPassword, role: userRole })
        await user.save()
        const clientData = {
            user: user._id,
            coach: coach._id
        }
        const client = new Client(clientData)
        await client.save()
        welcomeEmail(user.email)
        res.status(201).json({ user: user, client: client })

    } catch (err) {
        console.log(err)
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.status(404).json({ errors: 'Email not found' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_FORGET_PASS_EXPIRE })
        forgetPasswordMail(body.email, token)

        return res.status(200).json({ message: "Email Sent Successfully", token: token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.resetPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET)
        if (decodedToken) {
            const user = await User.findById(decodedToken.userId)
            if (!user) {
                return res.status(404).json({ errors: 'No user found' })
            }
            const body = req.body
            const salt = await bcryptjs.genSalt()
            const hashPassword = await bcryptjs.hash(body.password, salt)
            user.password = hashPassword
            await user.save()
            res.status(200).json(user)
        } else {
            return res.status(404).json({ errors: 'Invalid Token' })
        }
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.getAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const newUser = _.pick(user, ['_id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt'])
        return res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

userCtrl.updateAccount = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = _.pick(req.body, ['firstName', 'lastName', 'email'])
        const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
        return res.status(201).json(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt']))
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = userCtrl