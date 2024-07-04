require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { checkSchema } = require('express-validator')


const userCtrl = require('./app/controllers/user-ctrl')
const coachCtrl = require('./app/controllers/coach-ctrl')
const clientCtrl = require('./app/controllers/client-ctrl')

const { userRegisterValidations, userUpdateValidation, userLoginValidations, userForgetPasswordValidation, resetPasswordValidations } = require('./app/validations/user-validations')
const { coachUpdateValidation } = require('./app/validations/coach-validations')
const { clientUpdateValidations } = require('./app/validations/client-validations')

const authorizeUser = require('./app/middlewares/authorizeUser')
const authenticateUser = require('./app/middlewares/authenticateUser')
const upload = require('./app/middlewares/multer')

const configureDB = require('./config/db')

const app = express()
const port = process.env.PORT || 4000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())


app.get('/users/account', authenticateUser, userCtrl.getAccount)
app.put('/users/account', authenticateUser, checkSchema(userUpdateValidation), userCtrl.updateAccount)
app.put('/users/profileImageUpdate', authenticateUser, upload.single('profileImage'), userCtrl.profileImageUpdate)
app.post('/users/login', checkSchema(userLoginValidations), userCtrl.login)
app.post('/users/forgetPassword', checkSchema(userForgetPasswordValidation), userCtrl.forgetPassword)
app.post('/users/register/coach', checkSchema(userRegisterValidations), userCtrl.coachRegister)
app.post('/users/resetPassword/:token', checkSchema(resetPasswordValidations), userCtrl.resetPassword)
app.post('/users/register/client/:coachId', checkSchema(userRegisterValidations), userCtrl.clientRegister)


app.get('/coach', authenticateUser, authorizeUser(['coach']), coachCtrl.get)
app.put('/coach', authenticateUser, authorizeUser(['coach']), checkSchema(coachUpdateValidation), coachCtrl.update)
app.put('/coach/verification', authenticateUser, authorizeUser(['admin']), coachCtrl.verification)

app.put('/client', authenticateUser, authorizeUser(['client']), checkSchema(clientUpdateValidations), clientCtrl.update)
app.get('/client', authenticateUser, authorizeUser(['client']), clientCtrl.get)





app.listen(port, () => {
    console.log(`Server is running successfully on this url http://localhost:${port}`)
})