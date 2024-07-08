const mongoose = require('mongoose')
const { Schema, model } = mongoose

const workoutSchema = new Schema({
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

const workoutPlanEntrySchema = new Schema({
    id:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    workouts: [workoutSchema]
}, { _id: false })

const workoutPlanSchema = new Schema({
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
    workoutPlans: [workoutPlanEntrySchema]
})

const WorkoutPlan = model('WorkoutPlan', workoutPlanSchema)

module.exports = WorkoutPlan

// {
//     "client": "60d9f1f1f1f1f1f1f1f1f1f1",
//     "coach": "60d9f2f2f2f2f2f2f2f2f2f2",
//     "workoutPlans": [
//         {
//             "title": "Morning Workout",
//             "workouts": [
//                 {
//                     "workout": "60d9f3f3f3f3f3f3f3f3f3f3",
//                     "reps": 10,
//                     "sets": 3,
//                     "rest": 60,
//                     "note": "Focus on form"
//                 },
//                 {
//                     "workout": "60d9f4f4f4f4f4f4f4f4f4f4",
//                     "reps": 15,
//                     "sets": 4,
//                     "rest": 45,
//                     "note": "Increase weight gradually"
//                 }
//             ]
//         },
//         {
//             "title": "Evening Cardio",
//             "workouts": [
//                 {
//                     "workout": "60d9f5f5f5f5f5f5f5f5f5f5",
//                     "reps": 20,
//                     "sets": 5,
//                     "rest": 30,
//                     "note": "Keep heart rate up"
//                 }
//             ]
//         }
//     ]
// }