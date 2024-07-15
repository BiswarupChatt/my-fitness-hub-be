const nutritionPlanValidation = {
    additionalNotes: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Additional notes must be a string'
        }
    },
    'mealPlans': {
        in: ['body'],
        isArray: {
            errorMessage: 'Meal Plans must be an array'
        }
    },
    'mealPlans.*.title': {
        in: ['body'],
        isString: {
            errorMessage: 'Meal plan title must be a string'
        },
        notEmpty: {
            errorMessage: 'Meal plan title is required'
        }
    },
    'mealPlans.*.meals': {
        in: ['body'],
        isArray: {
            errorMessage: 'Meals must be an array'
        }
    },
    'mealPlans.*.meals.*.foodName': {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Invalid food item ID'
        },
        notEmpty: {
            errorMessage: 'Food name ID is required'
        }
    },
    'mealPlans.*.meals.*.unit': {
        in: ['body'],
        isString: {
            errorMessage: 'Unit must be a string'
        },
        notEmpty: {
            errorMessage: 'Unit is required'
        },

    },
    'mealPlans.*.meals.*.quantity': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Quantity must be a number'
        },
        notEmpty: {
            errorMessage: 'Quantity is required'
        }
    },
    'mealPlans.*.meals.*.calories': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Calories must be a number'
        },
        notEmpty: {
            errorMessage: 'Calories are required'
        }
    },
    'mealPlans.*.meals.*.carbohydrate': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Carbohydrate must be a number'
        },
        notEmpty: {
            errorMessage: 'Carbohydrate is required'
        }
    },
    'mealPlans.*.meals.*.protein': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Protein must be a number'
        },
        notEmpty: {
            errorMessage: 'Protein is required'
        }
    },
    'mealPlans.*.meals.*.fats': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Fats must be a number'
        },
        notEmpty: {
            errorMessage: 'Fats are required'
        }
    },
    'mealPlans.*.meals.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    }
}

const mealPlansValidations = {
    'mealPlans.title': {
        in: ['body'],
        isString: {
            errorMessage: 'Meal plan title must be a string'
        },
        notEmpty: {
            errorMessage: 'Meal plan title is required'
        }
    },
    'mealPlans.meals': {
        in: ['body'],
        isArray: {
            errorMessage: 'Meals must be an array'
        }
    },
    'mealPlans.meals.*.foodName': {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Invalid food item ID'
        },
        notEmpty: {
            errorMessage: 'Food name ID is required'
        }
    },
    'mealPlans.meals.*.unit': {
        in: ['body'],
        isString: {
            errorMessage: 'Unit must be a string'
        },
        notEmpty: {
            errorMessage: 'Unit is required'
        },

    },
    'mealPlans.meals.*.quantity': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Quantity must be a number'
        },
        notEmpty: {
            errorMessage: 'Quantity is required'
        }
    },
    'mealPlans.meals.*.calories': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Calories must be a number'
        },
        notEmpty: {
            errorMessage: 'Calories are required'
        }
    },
    'mealPlans.meals.*.carbohydrate': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Carbohydrate must be a number'
        },
        notEmpty: {
            errorMessage: 'Carbohydrate is required'
        }
    },
    'mealPlans.meals.*.protein': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Protein must be a number'
        },
        notEmpty: {
            errorMessage: 'Protein is required'
        }
    },
    'mealPlans.meals.*.fats': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Fats must be a number'
        },
        notEmpty: {
            errorMessage: 'Fats are required'
        }
    },
    'mealPlans.meals.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    }
}

module.exports = { nutritionPlanValidation, mealPlansValidations }