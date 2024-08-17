const mealPlanValidation = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'Title must be a string',
        },
        notEmpty: {
            errorMessage: 'Title cannot be empty',
        },
    },
    additionalNotes: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Additional notes must be a string',
        },
    },
    'foods.*.foodId': {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Food ID must be a valid MongoDB ID',
        },
        exists: {
            errorMessage: 'Food ID is required',
        },
    },
    'foods.*.unit': {
        in: ['body'],
        isIn: {
            options: [['grams', 'milliliter', 'pounds', 'ounces', 'piece']],
            errorMessage: 'Unit should be grams, milliliter, pounds, ounces, or piece'
        },
        isString: {
            errorMessage: 'Unit must be a string'
        },
        notEmpty: {
            errorMessage: 'Unit is required'
        }
    },
    'foods.*.quantity': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Quantity must be a number',
        },
        exists: {
            errorMessage: 'Quantity is required',
        },
    },
    'foods.*.calories': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Calories must be a number',
        },
        exists: {
            errorMessage: 'Calories are required',
        },
    },
    'foods.*.protein': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Protein must be a number',
        },
        exists: {
            errorMessage: 'Protein is required',
        },
    },
    'foods.*.fat': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Fat must be a number',
        },
        exists: {
            errorMessage: 'Fat is required',
        },
    },
    'foods.*.carbohydrate': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Carbohydrate must be a number',
        },
        exists: {
            errorMessage: 'Carbohydrate is required',
        },
    },
    'foods.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string',
        },
    },
}

module.exports = { mealPlanValidation }