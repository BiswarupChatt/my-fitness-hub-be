const userCtrl = {}
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const momentTz = require('moment-timezone')
const User = require('../models/user-model')
const Coach = require('../models/coach-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const uploadToCloudinary = require('../utility/cloudinary')
const { welcomeEmail, forgetPasswordMail } = require('../utility/nodeMailer')


userCtrl.getAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const newUser = _.pick(user, ['_id', 'firstName', 'lastName', 'email', 'role', 'profileImage', 'createdAt', 'updatedAt'])
        return res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

// userCtrl.updateAccount = async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }
//     try {
//         const body = _.pick(req.body, ['firstName', 'lastName', 'email'])
//         const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
//         return res.status(201).json(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt']))
//     } catch (err) {
//         res.status(500).json({ errors: "Something went wrong" })
//     }
// }

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
        if (user) {
            const now = momentTz().tz('Asia/Kolkata')
            const startDate = now.toDate()
            const endDate = now.add(1, 'month').toDate()
            const coachData = {
                user: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                payment: {
                    plan: 'monthly',
                    isActive: true,
                    startDate: startDate,
                    endDate: endDate
                }
            }
            const coach = new Coach(coachData)
            await coach.save()
            welcomeEmail(user.email)
            res.status(201).json({ user: user, coach: coach })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

userCtrl.loadCoachInfo = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET)
        if (!decodedToken) {
            return res.status(404).json({ errors: 'Invalid Link' })
        }
        const coach = await Coach.findOne({ user: decodedToken.coachId }).populate('user')
        if (!coach) {
            return res.status(400).json({ errors: "Coach Does't  Exists" })
        }
        res.status(201).json(coach)
    } catch (err) {
        console.log(err)
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
        const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET)
        if (!decodedToken) {
            return res.status(404).json({ errors: 'Invalid Link' })
        }
        const coach = await Coach.findOne({ user: decodedToken.coachId })
        if (!coach) {
            return res.status(400).json({ errors: 'Invalid coach ID' })
        }
        const user = new User({ ...body, password: hashPassword, role: userRole })
        await user.save()
        const clientData = {
            user: user._id,
            coach: coach.user
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
        if (!decodedToken) {
            return res.status(401).json({ errors: 'Invalid Token' })
        }

        const user = await User.findById(decodedToken.userId)
        if (!user) {
            return res.status(404).json({ errors: 'No user found' })
        }
        const { password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            return res.status(402).json({ errors: 'Password do not match' })
        }
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(password, salt)
        user.password = hashPassword
        await user.save()

        res.status(200).json({ message: 'Password restored Successfully' })
    } catch (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ errors: 'Token has expired' })
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ errors: 'Invalid Token' })
        }
        res.status(500).json({ errors: 'Something went wrong.' })
    }
}

userCtrl.profileImageUpdate = async (req, res) => {
    try {
        if (req.file) {
            const body = _.pick(req.body, ['profileImage'])
            const uploadOptions = {
                folder: 'my-fitness-hub/userProfileImage',
                quality: 'auto',
                transformation: [
                    { width: 200, height: 200, crop: 'fit', gravity: 'center' }
                ]
            }
            const result = await uploadToCloudinary(req.file.buffer, uploadOptions)
            body.profileImage = result.secure_url
            const user = await User.findByIdAndUpdate(req.user.id, body, { new: true })
            return res.status(201).json(_.pick(user, ["_id", "profileImage"]))
        } else {
            return res.status(500).json({ errors: "Unable to find image" })
        }
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

module.exports = userCtrl