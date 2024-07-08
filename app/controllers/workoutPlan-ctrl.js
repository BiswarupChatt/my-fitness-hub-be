const WorkoutPlan = require('../models/workoutPlan-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

const workoutPlanCtrl = {}

workoutPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { additionalNotes, workoutPlans } = req.body
        const client = req.params.clientId
        const coach = req.user.id

        const exists = await WorkoutPlan.findOne({ client: client })
        const findClient = await Client.findOne({ user: client })
        console.log(findClient)
        if (exists) {
            return res.status(400).json({ errors: "Workout plan already exists" })
        }
        if (findClient.coach.toString() !== coach.toString()) {
            return res.status(400).json({ errors: "You are not authorized to create" })
        }
        workoutPlans.forEach((ele) => {
            if (!ele.id) {
                ele.id = uuidv4()
            }
        })
        const workoutPlan = new WorkoutPlan({
            client: client,
            coach: coach,
            additionalNotes: additionalNotes,
            workoutPlans: workoutPlans
        })
        await workoutPlan.save()
        res.status(201).json(workoutPlan)
    }
    catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

workoutPlanCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach') {
            client = req.params.clientId
        } else {
            client = req.user.id
        }

        const findClient = await Client.findOne({ user: client })
        // console.log(findClient)
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found / Please provide client id to the params' })
        }
        if (req.user.role === 'coach' && findClient.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to view this client's workout plan" })
        }

        const workoutPlan = await WorkoutPlan.find({ client: client }).populate({
            path: 'workoutPlans.workouts.workout', model: 'Workout'
        }).populate('client coach')
        if (!workoutPlan) {
            return res.status(404).json({ errors: 'Workout plan not found' })
        }

        res.status(201).json(workoutPlan)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = workoutPlanCtrl
