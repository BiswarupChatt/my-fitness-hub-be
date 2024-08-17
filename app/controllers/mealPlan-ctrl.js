
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const MealPlan = require('../models/mealPlan-model')
mealPlanCtrl = {}


mealPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { foods, additionalNotes, title } = req.body
        const client = req.params.clientId
        const coach = req.user.id

        const findClient = await Client.findOne({ user: client })
        if (!findClient) {
            return res.status(400).json({ errors: "Client not found" })
        }

        if (findClient.coach.toString() !== coach.toString()) {
            return res.status(400).json({ errors: "You are not authorized to create" })
        }

        const mealPlan = new MealPlan({
            client: client,
            coach: coach,
            foods,
            additionalNotes,
            title
        })
        await mealPlan.save()
        res.status(201).json(mealPlan)

    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong during creating meal plan', err })
    }
}

mealPlanCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach' || req.user.role === 'admin') {
            client = req.params.clientId
        }
        else {
            client = req.user.id
        }

        console.log(`Fetching client with ID: ${client}`)

        const findClient = await Client.findOne({ user: client })
        if (!findClient) {
            console.log(`Client not found for ID: ${client}`)
            return res.status(404).json({ errors: 'Client not found / Please provide client id to the params' })
        }
        if (req.user.role === 'coach' || req.user.role === 'admin' && findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to view this client's Nutrition plan" })
        }

        const nutritionPlan = await MealPlan.find({ client: client }).populate({path: 'foods.foodId', model: 'FoodItem'}).populate('client coach')

        if (!nutritionPlan) {
            return res.status(404).json({ errors: 'Nutrition plan not found' })
        }
        res.status(201).json(nutritionPlan)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong 2', err })
    }
}

// mealPlanCtrl.updateAdditionalNotes = async (req, res) => {
//     try {
//         const clientId = req.params.clientId
//         const { additionalNotes } = req.body

//         const findClient = await Client.findOne({ user: clientId })
//         if (!findClient) {
//             return res.status(404).json({ errors: 'Client not found' })
//         }
//         if (findClient.coach._id.toString() !== req.user.id.toString()) {
//             return res.status(404).json({ errors: "You are not authorized to update additional notes" })
//         }
//         const nutritionPlan = await NutritionPlan.findOneAndUpdate({ client: clientId }, { additionalNotes: additionalNotes }, { new: true })
//         if (!nutritionPlan) {
//             return res.status(404).json({ errors: 'Nutrition plan not found' })
//         }
//         res.status(200).json(nutritionPlan)
//     } catch (err) {
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

// mealPlanCtrl.addMealPlans = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() })
//         }
//         const { title, meals } = req.body
//         const clientId = req.params.clientId
//         const id = uuidv4()
//         const addToNutritionPlan = {
//             id: id,
//             title: title,
//             meals: meals
//         }
//         const findClient = await Client.findOne({ user: clientId })
//         if (!findClient) {
//             return res.status(404).json({ errors: 'Client not found' })
//         }
//         if (findClient.coach._id.toString() !== req.user.id.toString()) {
//             return res.status(404).json({ errors: "You are not authorized to add this client's mealPlans" })
//         }

//         const updateNutritionPlan = await NutritionPlan.findOneAndUpdate({ client: clientId }, { $push: { mealPlans: addToNutritionPlan } }, { new: true })
//         res.status(201).json(updateNutritionPlan)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

// mealPlanCtrl.updateMealPlans = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() })
//         }
//         const { title, meals } = req.body
//         const { clientId, mealPlansId } = req.params

//         const findClient = await Client.findOne({ user: clientId })
//         if (!findClient) {
//             return res.status(404).json({ errors: 'Client not found' })
//         }
//         if (findClient.coach._id.toString() !== req.user.id.toString()) {
//             return res.status(404).json({ errors: "You are not authorized to update this client's mealPlans" })
//         }
//         const nutritionPlan = await NutritionPlan.findOne({ client: clientId })
//         if (!nutritionPlan) {
//             return res.status(404).json({ errors: 'Nutrition plan not found' })
//         }
//         const sessionIndex = nutritionPlan.mealPlans.findIndex((ele) => {
//             return ele.id === mealPlansId
//         })
//         if (sessionIndex === -1) {
//             return res.status(404).json({ errors: 'Meal Plans ID not found' })
//         }
//         nutritionPlan.mealPlans[sessionIndex].title = title
//         nutritionPlan.mealPlans[sessionIndex].meals = meals

//         await nutritionPlan.save()
//         res.status(200).json(nutritionPlan)
//     } catch (err) {
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

// mealPlanCtrl.deleteMealPlans = async (req, res) => {
//     try {
//         const { clientId, mealPlansId } = req.params
//         const findClient = await Client.findOne({ user: clientId })
//         if (!findClient) {
//             return res.status(404).json({ errors: 'Client not found' })
//         }
//         if (findClient.coach._id.toString() !== req.user.id.toString()) {
//             return res.status(404).json({ errors: "You are not authorized to delete this client's meal plan" })
//         }
//         const nutritionPlan = await NutritionPlan.findOne({ client: clientId })
//         if (!nutritionPlan) {
//             res.status(404).json({ errors: 'Nutrition plan not found' })
//         }
//         const mealPlanExists = nutritionPlan.mealPlans.find((ele) => {
//             return ele.id === mealPlansId
//         })
//         if (!mealPlanExists) {
//             return res.status(404).json({ errors: 'Meal plan not found' })
//         }
//         const deleteMealPLan = await NutritionPlan.findOneAndUpdate({ client: clientId }, { $pull: { mealPlans: { id: mealPlansId } } }, { new: true })
//         res.status(201).json(deleteMealPLan)
//     } catch (err) {
//         res.status(500).json({ errors: 'Something went wrong' })
//     }
// }

module.exports = mealPlanCtrl