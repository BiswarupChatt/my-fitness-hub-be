const mongoose = require('mongoose')
const { Schema, model } = mongoose

const foodSchema = new Schema({
    foodId: {
        type: Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    carbohydrate: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    }
}, { _id: false })

const mealPlanSchema = new Schema({
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
    title: {
        type: String,
        required: true
    },
    additionalNotes: {
        type: String,
        default: ''
    },
    foods: [foodSchema]
}, { timestamps: true })


const MealPlan = model('MealPlan', mealPlanSchema)

module.exports = MealPlan