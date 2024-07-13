const FoodItem = require('../models/foodItem-model')
const { validationResult } = require('express-validator')

const foodItemCtrl = {}

foodItemCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let isDefault
        if (req.user.role === 'admin') {
            isDefault = true
        }
        else {
            isDefault = false
        }
        const body = {
            isDefault: isDefault,
            coach: req.user.id,
            foodName: req.body.foodName,
            unit: req.body.unit,
            calories: req.body.calories,
            protein: req.body.protein,
            fat: req.body.fat,
            carbohydrates: req.body.carbohydrates
        }
        const foodItem = new FoodItem(body)
        await foodItem.save()
        res.status(201).json(foodItem)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = foodItemCtrl