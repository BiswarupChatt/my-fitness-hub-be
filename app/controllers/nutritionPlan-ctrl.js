const { v4: uuidv4 } = require('uuid')
const NutritionPlan = require('../models/nutritionPlan-model')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')

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

module.exports = nutritionPlanCtrl