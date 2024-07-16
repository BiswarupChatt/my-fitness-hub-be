const mongoose = require('mongoose')
const { Schema, model } = mongoose

const mealSchema = new Schema({
    foodName: {
        type: Schema.Types.ObjectId,
        ref: "FoodItem",
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
    carbohydrate: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    }
}, { _id: false })

const mealPlanSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    meals: [mealSchema]
}, { timestamps: true, _id: false })

const nutritionPlanSchema = new Schema({
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
    mealPlans: [mealPlanSchema]
})

const NutritionPlan = model('NutritionPlan', nutritionPlanSchema)

module.exports = NutritionPlan