require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { checkSchema } = require('express-validator')


const userCtrl = require('./app/controllers/user-ctrl')
const {userRegisterValidations, userLoginValidations, userForgetPasswordValidation} = require('./app/validations/user-validations')


const configureDB = require('./config/db')

const app = express()
const port = process.env.PORT || 4000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())
 

app.post('/users/register', checkSchema(userRegisterValidations), userCtrl.register)
app.post('/users/login', checkSchema(userLoginValidations), userCtrl.login)
app.post('/users/forgetPassword',checkSchema(userForgetPasswordValidation), userCtrl.forgetPassword)





app.listen(port, ()=>{
    console.log(`Server is running successfully on this url http://localhost:${port}`)
})