
const workoutPlanValidations = {
    client: {
        in: ['body'],
        exists: {
            errorMessage: "Client is Required"
        },
        notEmpty: {
            errorMessage: "Client cannot be empty"
        },
        isMongoId: {
            errorMessage: "Client must be a valid MongoId"
        },
        trim: true
    },
    coach: {
        in: ['body'],
        exists: {
            errorMessage: "Coach is Required"
        },
        notEmpty: {
            errorMessage: "Coach cannot be empty"
        },
        isMongoId: {
            errorMessage: "Coach must be a valid MongoId"
        },
        trim: true
    },
    additionalNotes: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Additional notes must be a string'
        }
    },
    'workoutPlans': {
        in: ['body'],
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'workoutPlans.*.title': {
        in: ['body'],
        exists: {
            errorMessage: "Title is Required"
        },
        notEmpty: {
            errorMessage: "Title cannot be empty"
        },
        trim: true
    },
    'workoutPlans.*.workouts': {
        in: ['body'],
        optional: true,
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'workoutPlans.*.workouts.*.workout': {
        in: ['body'],
        optional: true,
        isMongoId: {
            errorMessage: "Workout must be a valid Mongo ID"
        },
    },
    'workoutPlans.*.workouts.*.sets': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'Sets must be a positive integer'
        }
    },
    'workoutPlans.*.workouts.*.rest': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Rest must be a positive integer'
        }
    },
    'workoutPlans.*.workouts.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    },

}

module.exports = workoutPlanValidations