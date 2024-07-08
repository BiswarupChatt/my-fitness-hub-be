const WorkoutPlan = require('../models/workout-model')
const { validationResult } = require('express-validator')
const { v4: uuid } = require('uuid')

const workoutPlanCtrl = {}

workoutPlanCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try{
        
    }
    catch(err){
        res.status(500).json({ errors: 'Something went wrong' })
    }
}
