const mongoose = require('mongoose')
const Coach = require('../models/coach-model')
const momentTz = require('moment-timezone')
const moment = require('moment')
const { coachSubscriptionStatusEmail } = require('../utility/nodeMailer')

moment().format()

const updateCoachSubscriptionStatus = async () => {
    try {
        const now = momentTz().tz('Asia/Kolkata').toDate()
        const time = moment().format('Do MMMM YYYY, h:mm a')
        const result = await Coach.updateMany(
            {
                'payment.endDate': { $lt: now },
                'payment.isActive': true
            },
            {
                $set: { 'payment.isActive': false }
            }
        )
        console.log(`${result.modifiedCount} coaches updated.`)
        coachSubscriptionStatusEmail(result.modifiedCount, time)
    }
    catch (err) {
        console.error('Error updating coach subscription status:', err)
    }
}

module.exports = updateCoachSubscriptionStatus