const progressValidation = {
    date: {
        in: ['body'],
        isDate: {
            errorMessage: "Date must be in date format"
        },
        exists: {
            errorMessage: "Date is required"
        },
        notEmpty: {
            errorMessage: "Date cannot be empty"
        },
    },
    weight: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Weight must be a positive integer'
        }
    },
    chest: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Chest must be a positive integer'
        }
    },
    waist: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Waist must be a positive integer'
        }
    },
    hips: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Hips must be a positive integer'
        }
    },
    thigh: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Thigh must be a positive integer'
        }
    },
    bicep: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Bicep must be a positive integer'
        }
    }
}

const progressUpdateValidation = {
    date: {
        in: ['body'],
        optional: true,
        isDate: {
            errorMessage: "Date must be in date format"
        }
    },
    weight: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Weight must be a positive integer'
        }
    },
    chest: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Chest must be a positive integer'
        }
    },
    waist: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Waist must be a positive integer'
        }
    },
    hips: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Hips must be a positive integer'
        }
    },
    thigh: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Thigh must be a positive integer'
        }
    },
    bicep: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Bicep must be a positive integer'
        }
    }
}

module.exports = { progressValidation, progressUpdateValidation }