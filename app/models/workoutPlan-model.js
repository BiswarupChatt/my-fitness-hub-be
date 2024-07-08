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
    id: {
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
    additionalNotes: {
        type: String,
        required: false
    },
    workoutPlans: [workoutPlanEntrySchema]
})

const WorkoutPlan = model('WorkoutPlan', workoutPlanSchema)

module.exports = WorkoutPlan

// {
//     "client": "60d0fe4f5311236168a109ca",
//         "coach": "60d0fe4f5311236168a109cb",
//             "additionalNotes": "This is a general note for the workout plan.",
//                 "workoutPlans": [
//                     {
//                         "id": "a1b2c3d4e5f6g7h8i9j0",
//                         "title": "Strength Training Plan",
//                         "workouts": [
//                             {
//                                 "workout": "60d0fe4f5311236168a109cc",
//                                 "reps": 10,
//                                 "sets": 4,
//                                 "rest": 90,
//                                 "note": "Increase weight gradually"
//                             },
//                             {
//                                 "workout": "60d0fe4f5311236168a109cd",
//                                 "reps": 12,
//                                 "sets": 3,
//                                 "rest": 60,
//                                 "note": "Maintain proper posture"
//                             }
//                         ]
//                     },
//                     {
//                         "id": "z9y8x7w6v5u4t3s2r1q0",
//                         "title": "Cardio Plan",
//                         "workouts": [
//                             {
//                                 "workout": "60d0fe4f5311236168a109ce",
//                                 "reps": 1,
//                                 "sets": 1,
//                                 "rest": 0,
//                                 "note": "Warm-up properly before starting"
//                             }
//                         ]
//                     }
//                 ]
// }
