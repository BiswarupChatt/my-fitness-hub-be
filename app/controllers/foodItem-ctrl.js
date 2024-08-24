const foodItemCtrl = {}
const FoodItem = require('../models/')
const { validationResult } = require('express-validator')


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
            //todo:- logically set default quantity based on the unit selected
            quantity: req.body.quantity,
            calories: req.body.calories,
            protein: req.body.protein,
            fat: req.body.fat,
            carbohydrate: req.body.carbohydrate
        }
        const foodItem = new FoodItem(body)
        await foodItem.save()
        res.status(201).json(foodItem)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

foodItemCtrl.get = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, sortBy = 'foodName', sortOrder = 'asc', userFoodItem = 'false' } = req.query

        const searchQuery = {
            $or: [
                { foodName: { $regex: search, $options: 'i' } },
                { unit: { $regex: search, $options: 'i' } }
            ]
        }

        const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

        let foodItems
        let totalFoodItems

        if (userFoodItem === 'true') {
            foodItems = await FoodItem
                .find({ ...searchQuery, coach: req.user.id })
                .populate('coach')
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))

            totalFoodItems = await FoodItem.countDocuments({ ...searchQuery, coach: req.user.id })
        } else {
            const defaultFoodItems = await FoodItem
                .find({ ...searchQuery, isDefault: true })
                .populate('coach')
                .sort(sortOption)

            const coachFoodItems = await FoodItem
                .find({ ...searchQuery, coach: req.user.id })
                .populate('coach')
                .sort(sortOption)

            const combinedFoodItems = [...defaultFoodItems, ...coachFoodItems]
            combinedFoodItems.sort((x, y) => {
                if (x[sortBy] < y[sortBy]) {
                    return sortOrder === 'asc' ? -1 : 1
                }
                if (x[sortBy] > y[sortBy]) {
                    return sortOrder === 'asc' ? 1 : -1
                }
                return 0
            })

            foodItems = combinedFoodItems.slice((page - 1) * limit, page * limit)

            const totalDefaultFoodItems = await FoodItem.countDocuments({ ...searchQuery, isDefault: true })
            const totalCoachFoodItems = await FoodItem.countDocuments({ ...searchQuery, coach: req.user.id })
            totalFoodItems = totalDefaultFoodItems + totalCoachFoodItems
        }

        return res.status(200).json({
            foodItems: foodItems,
            totalFoodItems: totalFoodItems,
            totalPages: Math.ceil(totalFoodItems / limit),
            currentPage: parseInt(page)
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ errors: 'Something went wrong.', err: err })
    }
}



foodItemCtrl.update = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const body = {
            foodName: req.body.foodName,
            unit: req.body.unit,
            quantity: req.body.quantity,
            calories: req.body.calories,
            protein: req.body.protein,
            fat: req.body.fat,
            carbohydrates: req.body.carbohydrates
        }
        const foodItem = await FoodItem.findById(req.params._id)
        if (!foodItem) {
            return res.status(404).json({ errors: "Food item not found" })
        }
        if (req.user.id.toString() !== foodItem.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update" })
        }
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(req.params._id, body, { new: true })
        res.status(201).json(updatedFoodItem)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

foodItemCtrl.delete = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params._id)
        if (!foodItem) {
            return res.status(404).json({ errors: "Food item not found" })
        }
        if (req.user.id.toString() !== foodItem.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to delete" })
        }
        const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params._id)
        res.status(201).json(deletedFoodItem)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = foodItemCtrl