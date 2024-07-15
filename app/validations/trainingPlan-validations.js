
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
        notEmpty: {
            errorMessage: "Title cannot be empty"
        },
        trim: true
    },
    'workoutSessions.*.exercises': {
        in: ['body'],
        optional: true,
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'workoutSessions.*.exercises.*.workout': {
        in: ['body'],
        optional: true,
        isMongoId: {
            errorMessage: "Workout must be a valid Mongo ID"
        },
    },
    'workoutSessions.*.exercises.*.sets': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 1 },
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
    'workoutSessions.*.title': {
        in: ['body'],
        notEmpty: {
            errorMessage: "Title cannot be empty"
        },
        trim: true
    },
    'workoutSessions.*.exercises': {
        in: ['body'],
        optional: true,
        isArray: {
            errorMessage: 'Workout plans must be an array'
        }
    },
    'workoutSessions.*.exercises.*.workout': {
        in: ['body'],
        optional: true,
        isMongoId: {
            errorMessage: "Workout must be a valid Mongo ID"
        },
    },
    'workoutSessions.*.exercises.*.sets': {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 1 },
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


module.exports = { trainingPlanValidations, workoutSessionValidation }