const trainingPlanValidations = {
    additionalNotes: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Additional notes must be a string'
        }
    },
    'workoutSessions': {
        in: ['body'],
        isArray: {
            errorMessage: 'Workout sessions must be an array'
        }
    },
    'workoutSessions.*.title': {
        in: ['body'],
        isString: {
            errorMessage: 'Workout session title must be a string'
        },
        notEmpty: {
            errorMessage: "Workout session title cannot be empty"
        },
        trim: true
    },
    'workoutSessions.*.exercises': {
        in: ['body'],
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'workoutSessions.*.exercises.*.workout': {
        in: ['body'],
        isMongoId: {
            errorMessage: "Workout must be a valid Mongo ID"
        },
        notEmpty: {
            errorMessage: 'Workout ID is required'
        }
    },
    'workoutSessions.*.exercises.*.reps': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Reps must be a positive integer'
        }
    },
    'workoutSessions.*.exercises.*.sets': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Sets must be a positive integer'
        }
    },
    'workoutSessions.*.exercises.*.rest': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Rest must be a positive integer'
        }
    },
    'workoutSessions.*.exercises.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    },

}


const workoutSessionValidation = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'Workout session title must be a string'
        },
        notEmpty: {
            errorMessage: "Workout session title cannot be empty"
        },
        trim: true
    },
    exercises: {
        in: ['body'],
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'exercises.*.workout': {
        in: ['body'],
        isMongoId: {
            errorMessage: "Workout must be a valid Mongo ID"
        },
        notEmpty: {
            errorMessage: 'Workout ID is required'
        }
    },
    'exercises.*.reps': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Reps must be a positive integer'
        }
    },
    'exercises.*.sets': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Sets must be a positive integer'
        }
    },
    'exercises.*.rest': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Rest must be a positive integer'
        }
    },
    'exercises.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    },

}


module.exports = { trainingPlanValidations, workoutSessionValidation }