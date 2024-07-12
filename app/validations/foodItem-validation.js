const foodItemValidation = {
    foodName: {
        in: ['body'],
        isString: {
            options: { min: 0 },
            errorMessage: 'Food name must be a String'
        },
        exists: {
            errorMessage: "Food name is required"
        },
        notEmpty: {
            errorMessage: "Food name cannot be empty"
        },
        trim: true
    },
    unit: {
        in: ['body'],
        isString: {
            options: { min: 0 },
            errorMessage: 'Unit must be a String'
        },
        exists: {
            errorMessage: "Unit is required"
        },
        notEmpty: {
            errorMessage: "Unit cannot be empty"
        },
        trim: true
    },
    calories: {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Calories must be a positive integer'
        },
        exists: {
            errorMessage: "Calories is required"
        },
        notEmpty: {
            errorMessage: "Calories cannot be empty"
        },
        trim: true
    },
    protein: {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Protein must be a positive integer'
        },
        exists: {
            errorMessage: "Protein is required"
        },
        notEmpty: {
            errorMessage: "Protein cannot be empty"
        },
        trim: true
    },
    fat: {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Fat must be a positive integer'
        },
        exists: {
            errorMessage: "Fat is required"
        },
        notEmpty: {
            errorMessage: "Fat cannot be empty"
        },
        trim: true
    },
    carbohydrates: {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Carbohydrates must be a positive integer'
        },
        exists: {
            errorMessage: "Carbohydrates is required"
        },
        notEmpty: {
            errorMessage: "Carbohydrates cannot be empty"
        },
        trim: true
    }
}

module.exports = { foodItemValidation }