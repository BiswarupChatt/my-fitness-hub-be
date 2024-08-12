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
            errorMessage: 'Meal plans must be an array'
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
    'mealPlans.*.foods': {
        in: ['body'],
        isArray: {
            errorMessage: 'Foods must be an array'
        }
    },
    'mealPlans.*.foods.*.foodId': {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Invalid food item ID'
        },
        notEmpty: {
            errorMessage: 'Food ID is required'
        }
    },
    // 'mealPlans.*.foods.*.unit': {
    //     in: ['body'],
    //     isIn: {
    //         options: [['grams', 'milliliter', 'pounds', 'ounces', 'piece']],
    //         errorMessage: 'Unit should be grams, milliliter, pounds, ounces, or piece'
    //     },
    //     isString: {
    //         errorMessage: 'Unit must be a string'
    //     },
    //     notEmpty: {
    //         errorMessage: 'Unit is required'
    //     }
    // },
    'mealPlans.*.foods.*.quantity': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Quantity must be a number'
        },
        notEmpty: {
            errorMessage: 'Quantity is required'
        }
    },
    'mealPlans.*.foods.*.calories': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Calories must be a number'
        },
        notEmpty: {
            errorMessage: 'Calories are required'
        }
    },
    'mealPlans.*.foods.*.carbohydrate': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Carbohydrate must be a number'
        },
        notEmpty: {
            errorMessage: 'Carbohydrate is required'
        }
    },
    'mealPlans.*.foods.*.protein': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Protein must be a number'
        },
        notEmpty: {
            errorMessage: 'Protein is required'
        }
    },
    'mealPlans.*.foods.*.fat': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Fat must be a number'
        },
        notEmpty: {
            errorMessage: 'Fat is required'
        }
    },
    'mealPlans.*.foods.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    }
}


const mealPlansValidations = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'Meal plan title must be a string'
        },
        notEmpty: {
            errorMessage: 'Meal plan title is required'
        }
    },
    meals: {
        in: ['body'],
        isArray: {
            errorMessage: 'Meals must be an array'
        }
    },
    'meals.*.foodId': {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Invalid food item ID'
        },
        notEmpty: {
            errorMessage: 'Food name ID is required'
        }
    },
    'meals.*.unit': {
        in: ['body'],
        isIn: {
            options: [['grams', 'milliliter', 'pounds', 'ounces', 'piece']],
            errorMessage: 'Unit should be between grams, milliliter, pounds, ounces or piece '
        },
        isString: {
            errorMessage: 'Unit must be a string'
        },
        notEmpty: {
            errorMessage: 'Unit is required'
        },

    },
    'meals.*.quantity': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Quantity must be a number'
        },
        notEmpty: {
            errorMessage: 'Quantity is required'
        }
    },
    'meals.*.calories': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Calories must be a number'
        },
        notEmpty: {
            errorMessage: 'Calories are required'
        }
    },
    'meals.*.carbohydrate': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Carbohydrate must be a number'
        },
        notEmpty: {
            errorMessage: 'Carbohydrate is required'
        }
    },
    'meals.*.protein': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Protein must be a number'
        },
        notEmpty: {
            errorMessage: 'Protein is required'
        }
    },
    'meals.*.fats': {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Fats must be a number'
        },
        notEmpty: {
            errorMessage: 'Fats are required'
        }
    },
    'meals.*.note': {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Note must be a string'
        }
    }
}

module.exports = { nutritionPlanValidation, mealPlansValidations }