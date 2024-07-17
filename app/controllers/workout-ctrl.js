const workoutCtrl = {}
const Workout = require('../models/workout-model')
const { validationResult } = require('express-validator')


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

workoutCtrl.get = async (req, res) => {
    try {
        const defaultWorkout = await Workout.find({ isDefault: true }).populate("coach")
        const coachWorkout = await Workout.find({ coach: req.user.id }).populate("coach")
        const all = defaultWorkout.concat(coachWorkout)
        res.status(201).json(all)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

workoutCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = {
            exerciseName: req.body.exerciseName,
            videoLink: req.body.videoLink
        }
        const workout = await Workout.findById(req.params._id)
        if (!workout) {
            return res.status(404).json({ errors: "Workout not found" })
        }
        if (req.user.id.toString() !== workout.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update" })
        }
        const updatedWorkout = await Workout.findByIdAndUpdate(req.params._id, body, { new: true })
        res.status(201).json(updatedWorkout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

workoutCtrl.delete = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params._id)
        if (!workout) {
            return res.status(404).json({ errors: "Workout not found" })
        }
        if (req.user.id.toString() !== workout.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to delete" })
        }
        const deletedWorkout = await Workout.findByIdAndDelete(req.params._id)
        res.status(201).json(deletedWorkout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = workoutCtrl
