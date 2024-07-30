const User = require("../models/user-model")

const userRegisterValidations = {
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
            options: async (value) => {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw new Error('Email Already Taken')
                } else {
                    return true
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: "Password is required"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    },
    role: {
        in: ['body'],
        optional: true,
        notEmpty: {
            errorMessage: "Role cannot be empty"
        },
        isIn: {
            options: [['coach', 'client']],
            errorMessage: 'role either should be a coach or client'
        },
        trim: true
    }
}

const userLoginValidations = {
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
        trim: true,
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: "Password is required"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    },
}

const userForgetPasswordValidation = {
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
        trim: true,
        normalizeEmail: true
    }
}

const resetPasswordValidations = {
    password: {
        in: ['body'],
        exists: {
            errorMessage: "Password is required"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password should be between 8-128 character'
        },
        trim: true
    }
}

module.exports = { userRegisterValidations, userLoginValidations, userForgetPasswordValidation, resetPasswordValidations }