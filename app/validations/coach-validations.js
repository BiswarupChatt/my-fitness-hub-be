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