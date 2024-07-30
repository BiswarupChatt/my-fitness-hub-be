const User = require('../models/user-model')

const coachUpdateValidation = {

    phoneNumber: {
        in: ['body'],
        optional: true,
        isMobilePhone: {
            errorMessage: "Phone Number must be valid"
        },
        isLength: {
            options: {
                min: 10,
                max: 10
            },
            errorMessage: "Phone Number must be Ten Digits"
        }
    },
    dateOfBirth: {
        in: ['body'],
        optional: true,
        isDate: {
            errorMessage: "Date od birth must be as a date format"
        },
        custom: {
            options: (value) => {
                const date = new Date(value)
                const today = new Date()
                if (date > today) {
                    throw new Error('Date of birth cannot be in the future')
                } return true
            }
        }
    },
    gender: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['male', 'female', 'other']],
            errorMessage: 'Gender either should be a male or female'
        }
    },
    weight: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Weight should be a positive number'
        }
    },
    height: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: 'height must be a number'
        }
    },
    firstName: {
        in: ['body'],
        exists: {
            errorMessage: "First name is required"
        },
        notEmpty: {
            errorMessage: "First name cannot be empty"
        },
        trim: true
    },
    lastName: {
        in: ['body'],
        exists: {
            errorMessage: "Last name is required"
        },
        notEmpty: {
            errorMessage: "Last name cannot be empty"
        },
        trim: true
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: "Email is required"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
        isEmail: {
            errorMessage: "Email Should be In valid format"
        },
        custom: {
            options: async (value, { req }) => {
                const userId = req.user.id
                const user = await User.findOne({ email: value })
                if (user && user.id !== userId) {
                    throw new Error('Email already taken')
                } else {
                    return true;
                }
            }
        },
        trim: true,
        normalizeEmail: true
    }

}

const invitationEmailValidation = {
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: "Email must be in a valid format"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
    }
}


module.exports = { coachUpdateValidation, invitationEmailValidation }