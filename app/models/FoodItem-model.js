const mongoose = require('mongoose')
const { Schema, model } = mongoose

const foodItemSchema = new Schema({
    isDefault: {
        type: Boolean,
        required: true
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "User"
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
        type: String,
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
    }
})

const FoodItem = model('FoodItem', foodItemSchema)
module.exports = FoodItem