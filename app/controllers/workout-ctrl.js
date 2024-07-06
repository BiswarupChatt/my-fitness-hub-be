const Workout = require('../models/workout-model')
const { validationResult } = require('express-validator')

const workoutCtrl = {}

workoutCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let isDefault

        if (req.user.role === "admin") {
            isDefault = true
        } else {
            isDefault = false
        }
        const body = {
            isDefault: isDefault,
            coach: req.user.id,
            exerciseName: req.body.exerciseName,
            videoLink: req.body.videoLink
        }
        const workout = new Workout(body)
        await workout.save()
        res.status(201).json(workout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = workoutCtrl
