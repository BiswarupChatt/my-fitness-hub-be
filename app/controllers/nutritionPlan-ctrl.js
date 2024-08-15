nutritionPlanCtrl = {}
const { v4: uuidv4 } = require('uuid')
const Client = require('../models/client-model')
const { validationResult } = require('express-validator')
const NutritionPlan = require('../models/nutritionPlan-model')


nutritionPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { mealPlans, additionalNotes } = req.body
        const client = req.params.clientId
        const coach = req.user.id

        const findClient = await Client.findOne({ user: client })
        if (!findClient) {
            return res.status(400).json({ errors: "Client not found" })
        }

        if (findClient.coach.toString() !== coach.toString()) {
            return res.status(400).json({ errors: "You are not authorized to create" })
        }

        const exists = await NutritionPlan.findOne({ client: client })

        mealPlans.forEach((ele) => {
            if (!ele.id) {
                ele.id = uuidv4()
            }
        })

        if (exists) {
            exists.mealPlans = mealPlans;
            exists.additionalNotes = additionalNotes;
            await exists.save();
            return res.status(200).json(exists)
        } else {
            const nutritionPlan = new NutritionPlan({
                client: client,
                coach: coach,
                mealPlans: mealPlans,
                additionalNotes: additionalNotes
            })
            await nutritionPlan.save()
            res.status(201).json(nutritionPlan)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong 1', err })
    }
}

nutritionPlanCtrl.get = async (req, res) => {
    try {
        let client
        if (req.user.role === 'coach' || req.user.role === 'admin') {
            client = req.params.clientId
        } 
        // else {
        //     client = req.user.id
        // }

        console.log(`Fetching client with ID: ${client}`)

        const findClient = await Client.findOne({ user: client })
        if (!findClient) {
            console.log(`Client not found for ID: ${client}`)
            return res.status(404).json({ errors: 'Client not found / Please provide client id to the params' })
        }
        if (req.user.role === 'coach' && findClient.coach._id.toString() !== req.user.id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to view this client's Nutrition plan" })
        }

        const nutritionPlan = await NutritionPlan.findOne({ client: client }).populate({
            path: 'mealPlans.foods.foodId', model: 'FoodItem'
        }).populate('client coach')
        if (!nutritionPlan) {
            return res.status(404).json({ errors: 'Nutrition plan not found' })
        }
        res.status(201).json(nutritionPlan)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong 2', err })
    }
}

// nutritionPlanCtrl.updateAdditionalNotes = async (req, res) => {
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

// nutritionPlanCtrl.addMealPlans = async (req, res) => {
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

// nutritionPlanCtrl.updateMealPlans = async (req, res) => {
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

// nutritionPlanCtrl.deleteMealPlans = async (req, res) => {
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

module.exports = nutritionPlanCtrl