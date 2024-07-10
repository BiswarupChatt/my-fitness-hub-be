const TrainingPlan = require('../models/trainingPlan-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

const trainingPlanCtrl = {}

trainingPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { additionalNotes, workoutSessions } = req.body
        const client = req.params.clientId
        const coach = req.user.id

        const exists = await TrainingPlan.findOne({ client: client })
        const findClient = await Client.findOne({ user: client })
        console.log(findClient)
        if (exists) {
            return res.status(400).json({ errors: "Workout plan already exists" })
        }
        if (findClient.coach.toString() !== coach.toString()) {
            return res.status(400).json({ errors: "You are not authorized to create" })
        }
        workoutSessions.forEach((ele) => {
            if (!ele.id) {
                ele.id = uuidv4()
            }
        })
        const trainingPlan = new TrainingPlan({
            client: client,
            coach: coach,
            additionalNotes: additionalNotes,
            workoutSessions: workoutSessions
        })
        await trainingPlan.save()
        res.status(201).json(trainingPlan)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

trainingPlanCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach') {
            client = req.params.clientId
        } else {
            client = req.user.id
        }

        const findClient = await Client.findOne({ user: client })
        console.log(findClient)
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found / Please provide client id to the params' })
        }
        if (req.user.role === 'coach' && findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to view this client's workout plan" })
        }

        const trainingPlan = await TrainingPlan.find({ client: client }).populate({
            path: 'workoutSessions.exercises.workout', model: 'Workout'
        }).populate('client coach')
        if (!trainingPlan) {
            return res.status(404).json({ errors: 'Workout plan not found' })
        }

        res.status(201).json(trainingPlan)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

trainingPlanCtrl.addWorkoutSession = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { workoutSession } = req.body
        const clientId = req.params.clientId

        const findClient = await Client.findOne({ user: clientId })
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found' })
        }
        if (findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update this client's workoutSessions" })
        }

        if (!workoutSession.id) {
            workoutSession.id = uuidv4()
        }

        const updatedTrainingPlan = await TrainingPlan.findOneAndUpdate({ client: clientId }, { $push: { workoutSessions: workoutSession } }, { new: true })
        res.status(201).json(updatedTrainingPlan)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

// todo update workout session

trainingPlanCtrl.deleteWorkoutSession = async (req, res) => {
    try {
        const { workoutSessionId, clientId } = req.params
        const findClient = await Client.findOne({ user: clientId })
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found' })
        }
        if (findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to delete this client's workoutSessions" })
        }
        const trainingPlan = await TrainingPlan.findOne({ client: clientId })
        if (!trainingPlan) {
            return res.status(404).json({ errors: 'Training plan not found' })
        }

        const sessionExists = trainingPlan.workoutSessions.find((ele) => {
            return ele.id === workoutSessionId
        })
        if (!sessionExists) {
            return res.status(404).json({ errors: 'Workout Session ID not found' })
        }

        const deleteWorkoutSession = await TrainingPlan.findOneAndUpdate({ client: clientId }, { $pull: { workoutSessions: { id: workoutSessionId } } }, { new: true })
        res.status(200).json(deleteWorkoutSession)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = trainingPlanCtrl
