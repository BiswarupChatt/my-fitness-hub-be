const { v4: uuidv4 } = require('uuid')
const NutritionPlan = require('../models/nutritionPlan-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const TrainingPlan = require('../models/trainingPlan-model')

nutritionPlanCtrl = {}

nutritionPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { mealPlans, additionalNotes } = req.body
        const client = req.params.clientId
        const coach = req.user.id

        const exists = await NutritionPlan.findOne({ client: client })
        const findClient = await Client.findOne({ user: client })
        if (exists) {
            return res.status(400).json({ errors: "Nutrition plan already exists" })
        }
        if (!findClient) {
            return res.status(400).json({ errors: "Client not found" })
        }
        if (findClient.coach.toString() !== coach.toString()) {
            return res.status(400).json({ errors: "You are not authorized to create" })
        }
        mealPlans.forEach((ele) => {
            if (!ele.id) {
                ele.id = uuidv4()
            }
        })
        const nutritionPlan = new NutritionPlan({
            client: client,
            coach: coach,
            mealPlans: mealPlans,
            additionalNotes: additionalNotes
        })
        await nutritionPlan.save()
        res.status(201).json(nutritionPlan)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

nutritionPlanCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach') {
            client = req.params.clientId
        } else {
            client = req.user.id
        }

        const findClient = await Client.findOne({ user: client })
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found / Please provide client id to the params' })
        }
        if (req.user.role === 'coach' && findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to view this client's Nutrition plan" })
        }

        const nutritionPlan = await NutritionPlan.findOne({ client: client }).populate({
            path: 'mealPlans.meals.foodName', model: 'FoodItem'
        }).populate('client coach')
        if (!nutritionPlan) {
            return res.status(404).json({ errors: 'Nutrition plan not found' })
        }
        res.status(201).json(nutritionPlan)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

nutritionPlanCtrl.updateAdditionalNotes = async (req, res) => {
    try {
        const clientId = req.params.clientId
        const { additionalNotes } = req.body

        const findClient = await Client.findOne({ user: clientId })
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found' })
        }
        if (findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update additional notes" })
        }
        const nutritionPlan = await NutritionPlan.findOneAndUpdate({ client: clientId }, { additionalNotes: additionalNotes }, { new: true })
        if (!nutritionPlan) {
            return res.status(404).json({ errors: 'Nutrition plan not found' })
        }
        res.status(200).json(nutritionPlan)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

nutritionPlanCtrl.addMealPlans = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { mealPlans } = req.body
        const clientId = req.params.clientId

        const findClient = await Client.findOne({ user: clientId })
        if (!findClient) {
            return res.status(404).json({ errors: 'Client not found' })
        }
        if (findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to add this client's Meal Plans" })
        }

        if (!mealPlans.id) {
            mealPlans.id = uuidv4()
        }
        const updateNutritionPlan = await NutritionPlan.findOneAndUpdate({ client: clientId }, { $push: { mealPlans: mealPlans } }, { new: true })
        res.status(201).json(updateNutritionPlan)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

// nutritionPlanCtrl.updateMealPlans = async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

// nutritionPlanCtrl.deleteMealPlans = async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

module.exports = nutritionPlanCtrl