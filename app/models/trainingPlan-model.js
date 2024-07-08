const mongoose = require('mongoose')
const { Schema, model } = mongoose

const exerciseSchema = new Schema({
    workout: {
        type: Schema.Types.ObjectId,
        ref: "Workout",
        required: false
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
        required: false
    }
}, { _id: false })

const workoutSessionSchema = new Schema({
    id: {
        type: String,
        required: true
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
        required: false
    },
    workoutSessions: [workoutSessionSchema]
})

const TrainingPlan = model('trainingPlan', trainingPlanSchema)

module.exports = TrainingPlan


