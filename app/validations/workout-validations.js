const workoutValidation = {
    exerciseName: {
        in: ['body'],
        exists: {
            errorMessage: "Title is Required"
        },
        notEmpty: {
            errorMessage: "Title cannot be empty"
        },
        trim: true
    },
    videoLink: {
        in: ['body'],
        trim: true
    }
}

module.exports = { workoutValidation }