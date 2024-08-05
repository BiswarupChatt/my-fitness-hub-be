const mongoose = require('mongoose')
const { Schema, model } = mongoose


const workoutSchema = new Schema({
    isDefault: {
        type: Boolean,
        default: false
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    exerciseName: String,
    videoLink: String
}, { timestamps: true })

const WorkoutItem = model('WorkoutItems', workoutSchema)

module.exports = WorkoutItem