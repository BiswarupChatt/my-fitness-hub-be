const workoutCtrl = {}
const WorkoutItem = require('../models/workout-model')
const { validationResult } = require('express-validator')


workoutCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let isDefault

        if (req.user.role === "admin") {
            isDefault = true
        } else {
            isDefault = false
        }
        const body = {
            isDefault: isDefault,
            coach: req.user.id,
            exerciseName: req.body.exerciseName,
            videoLink: req.body.videoLink
        }
        const workout = new WorkoutItem(body)
        await workout.save()
        res.status(201).json(workout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

workoutCtrl.get = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', userWorkoutItem = 'false' } = req.query

        const searchQuery = {
            $or: [
                { exerciseName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        const skip = (page - 1) * limit

        let workoutItems
        let totalWorkoutItems

        if (userWorkoutItem === 'true') {
            workoutItems = await WorkoutItem
                .find({ ...searchQuery, coach: req.user.id })
                .populate('coach')
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))

            totalWorkoutItems = await WorkoutItem.countDocuments({ ...searchQuery, coach: req.user.id })
        } else {
            const defaultWorkoutItemsPromise = WorkoutItem
                .find({ ...searchQuery, isDefault: true })
                .populate('coach')
                .sort(sortOption)

            const coachWorkoutItemsPromise = WorkoutItem
                .find({ ...searchQuery, coach: req.user.id })
                .populate('coach')
                .sort(sortOption)

            const [defaultWorkoutItems, coachWorkoutItems] = await Promise.all([defaultWorkoutItemsPromise, coachWorkoutItemsPromise])
            
            const combinedWorkoutItems = [...defaultWorkoutItems, ...coachWorkoutItems];

            const uniqueWorkoutItems = combinedWorkoutItems.reduce((acc, current) => {
                const x = acc.find(item => item.exerciseName === current.exerciseName);
                if (!x) {
                    acc.push(current);
                }
                return acc;
            }, []);

            uniqueWorkoutItems.sort((x, y) => {
                if (x[sortBy] < y[sortBy]) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (x[sortBy] > y[sortBy]) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });

            workoutItems = uniqueWorkoutItems.slice(skip, skip + parseInt(limit));
            totalWorkoutItems = uniqueWorkoutItems.length;
        }
        return res.status(200).json({
            workoutItems: workoutItems,
            totalWorkoutItems: totalWorkoutItems,
            totalPages: Math.ceil(totalWorkoutItems / limit),
            currentPage: parseInt(page)
        })
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong.', err: err.message })
    }
}


workoutCtrl.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = {
            exerciseName: req.body.exerciseName,
            videoLink: req.body.videoLink
        }
        const workout = await WorkoutItem.findById(req.params._id)
        if (!workout) {
            return res.status(404).json({ errors: "WorkoutItem not found" })
        }
        if (req.user.id.toString() !== workout.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to update" })
        }
        const updatedWorkout = await WorkoutItem.findByIdAndUpdate(req.params._id, body, { new: true })
        res.status(201).json(updatedWorkout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

workoutCtrl.delete = async (req, res) => {
    try {
        const workout = await WorkoutItem.findById(req.params._id)
        if (!workout) {
            return res.status(404).json({ errors: "WorkoutItem not found" })
        }
        if (req.user.id.toString() !== workout.coach._id.toString()) {
            return res.status(404).json({ errors: "You are not authorized to delete" })
        }
        const deletedWorkout = await WorkoutItem.findByIdAndDelete(req.params._id)
        res.status(201).json(deletedWorkout)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

module.exports = workoutCtrl
