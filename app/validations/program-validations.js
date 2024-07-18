const programValidation = {
    programName: {
        in: ['body'],
        isString: {
            errorMessage: 'Program name must be a String'
        },
        notEmpty: {
            errorMessage: "Program name cannot be empty"
        },
        trim: true
    },
    description: {
        in: ['body'],
        isString: {
            errorMessage: 'Description name must be a String'
        },
        notEmpty: {
            errorMessage: "Description name cannot be empty"
        },
        trim: true
    },
    duration: {
        in: ['body'],
        isInt: {
            options: { min: 1 },
            errorMessage: 'Duration must be a positive integer'
        },
        notEmpty: {
            errorMessage: "Duration name cannot be empty"
        },
        trim: true
    }
}

module.exports = { programValidation }