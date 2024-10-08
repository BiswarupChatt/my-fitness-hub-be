const mongoose = require('mongoose')
const { Schema, model } = mongoose

const exerciseSchema = new Schema({
    workout: {
        type: Schema.Types.ObjectId,
        ref: "Workout",
        required: true
    },
    reps: {
        type: Number,
        required: false
    },
    sets: {
        type: Number,
        required: false,
    },
    rest: {
        type: Number,
        required: false
    },
    note: {
        type: String,
        default: ''
    }
}, { _id: false })

const workoutSessionSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema]
}, { timestamps: true, _id: false })

const trainingPlanSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    additionalNotes: {
        type: String,
        default: ''
    },
    workoutSessions: [workoutSessionSchema]
})

const TrainingPlan = model('trainingPlan', trainingPlanSchema)

module.exports = TrainingPlan


