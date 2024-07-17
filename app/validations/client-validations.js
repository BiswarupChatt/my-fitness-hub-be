const clientUpdateValidations = {
    phoneNumber: {
        in: ['body'],
        isMobilePhone:{
            errorMessage: "Phone Number must be valid"
        },
        isLength:{
            options:{
                min: 10,
                max: 10
            },
            errorMessage: "Phone Number must be Ten Digits"
        }
    }, 
    dateOfBirth: {
        in: ['body'],
        isDate:{
            errorMessage: "Date od birth must be as a date format"
        },
        custom:{
            options: (value)=>{
                const date = new Date(value)
                const today = new Date()
                if(date> today){
                    throw new Error('Date of birth cannot be in the future')
                }return true
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
    }
    
}

module.exports = {clientUpdateValidations}