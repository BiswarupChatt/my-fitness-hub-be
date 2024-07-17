const coachUpdateValidation = {

    phoneNumber: {
        in: ['body'],
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
        isIn: {
            options: [['Male', 'Female']],
            errorMessage: 'Gender either should be a male or female'
        }
    },
    weight: {
        in: ['body'],
        isFloat: {
            errorMessage: 'Weight must be a number'
        }
    },
    height: {
        in: ['body'],
        isFloat: {
            errorMessage: 'height must be a number'
        }
    },
    "bankDetails.accName": {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: "Account name must be a string"
        },
        trim: true
    },
    "bankDetails.accNumber": {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: "Account number must be a string"
        },
        trim: true
    },
    "bankDetails.ifscCode": {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: "ifsc code must be a string"
        },
        trim: true
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