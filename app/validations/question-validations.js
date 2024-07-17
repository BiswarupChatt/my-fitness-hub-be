const questionValidation = {
    title: {
        in: ['body'],
        exists: {
            errorMessage: "Title is Required"
        },
        notEmpty: {
            errorMessage: "Title cannot be empty"
        },
        trim: true
    }
}

module.exports = { questionValidation }