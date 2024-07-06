const answerValidations = {
    question: {
        in: ['body'],
        isMongoId: {
            errorMessage: "question must be a valid Mongo ID"
        },
        exists: {
            errorMessage: "Question is required"
        },
        notEmpty: {
            errorMessage: "Question cannot be empty"
        },
        trim: true
    },
    answer: {
        in: ['body'],
        exists: {
            errorMessage: "Answer is required"
        },
        notEmpty: {
            errorMessage: "Answer cannot be empty"
        },
        trim: true
    }
}

const answerUpdateValidations = {
    answer: {
        in: ['body'],
        exists: {
            errorMessage: "Answer is required"
        },
        notEmpty: {
            errorMessage: "Answer cannot be empty"
        },
        trim: true
    }
}

module.exports = { answerValidations, answerUpdateValidations }