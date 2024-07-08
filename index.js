require('dotenv').config()

const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const { checkSchema } = require('express-validator')

const userCtrl = require('./app/controllers/user-ctrl')
const coachCtrl = require('./app/controllers/coach-ctrl')
const clientCtrl = require('./app/controllers/client-ctrl')
const answerCtrl = require('./app/controllers/answer-ctrl')
const workoutCtrl = require('./app/controllers/workout-ctrl')
const questionCtrl = require('./app/controllers/question-ctrl')
const trainingPlanCtrl = require('./app/controllers/workoutPlan-ctrl')

const { workoutValidation } = require('./app/validations/workout-validations')
const { questionValidation } = require('./app/validations/question-validations')
const { coachUpdateValidation } = require('./app/validations/coach-validations')
const { clientUpdateValidations } = require('./app/validations/client-validations')
const { answerValidations, answerUpdateValidations } = require('./app/validations/answer-validations')
const {trainingPlanValidations} = require('./app/validations/workoutPlan-validations')
const { userRegisterValidations, userUpdateValidation, userLoginValidations, userForgetPasswordValidation, resetPasswordValidations } = require('./app/validations/user-validations')

const upload = require('./app/middlewares/multer')
const authorizeUser = require('./app/middlewares/authorizeUser')
const authenticateUser = require('./app/middlewares/authenticateUser')

const configureDB = require('./config/db')

const app = express()
const port = process.env.PORT || 4000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())


app.get('/users/account', authenticateUser, userCtrl.getAccount)
app.put('/users/account', authenticateUser, checkSchema(userUpdateValidation), userCtrl.updateAccount)
app.post('/users/login', checkSchema(userLoginValidations), userCtrl.login)
app.post('/users/register/coach', checkSchema(userRegisterValidations), userCtrl.coachRegister)
app.post('/users/register/client/:coachId', checkSchema(userRegisterValidations), userCtrl.clientRegister)
app.post('/users/forgetPassword', checkSchema(userForgetPasswordValidation), userCtrl.forgetPassword)
app.post('/users/resetPassword/:token', checkSchema(resetPasswordValidations), userCtrl.resetPassword)
app.put('/users/profileImageUpdate', authenticateUser, upload.single('profileImage'), userCtrl.profileImageUpdate)


app.get('/coach', authenticateUser, authorizeUser(['coach']), coachCtrl.getMy)
app.put('/coach', authenticateUser, authorizeUser(['coach']), checkSchema(coachUpdateValidation), coachCtrl.update)
app.get('/coach/getAllClient', authenticateUser, authorizeUser(['coach']), coachCtrl.getAllCLient)
app.get('/coach/getSingleCLient/:userId', authenticateUser, authorizeUser(['coach']), coachCtrl.getSingleCLient)
app.put('/coach/verification', authenticateUser, authorizeUser(['admin']), coachCtrl.verification)


app.put('/client', authenticateUser, authorizeUser(['client']), checkSchema(clientUpdateValidations), clientCtrl.update)
app.get('/client', authenticateUser, authorizeUser(['client']), clientCtrl.getMy)


app.post('/question', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.create)
app.get('/question', authenticateUser, questionCtrl.getDefault)
app.get('/question/:coachId', authenticateUser, questionCtrl.get)
app.put('/question/:_id', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.update)
app.delete('/question/:_id', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.delete)


app.post('/answer', authenticateUser, authorizeUser(['client']), checkSchema(answerValidations), answerCtrl.create)
app.get('/answer', authenticateUser, authorizeUser(['client']), answerCtrl.getMyAnswer)
app.get('/answer/:clientId', authenticateUser, authorizeUser(['coach', 'admin']), answerCtrl.getClientAnswer)
app.put('/answer/:_id', authenticateUser, authorizeUser(['client']), checkSchema(answerUpdateValidations), answerCtrl.update)
app.delete('/answer/:_id', authenticateUser, authorizeUser(['client']), answerCtrl.delete)

app.post('/workout', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(workoutValidation), workoutCtrl.create)
app.get('/workout/:coachId?', authenticateUser, workoutCtrl.get)
app.put('/workout/:_id', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(workoutValidation), workoutCtrl.update)
app.delete('/workout/:_id', authenticateUser, authorizeUser(['coach', 'admin']), workoutCtrl.delete)

app.post('/training-plan/:clientId', authenticateUser, authorizeUser(['coach']), checkSchema(trainingPlanValidations), trainingPlanCtrl.create)
app.get('/training-plan/:clientId?', authenticateUser, trainingPlanCtrl.get)

app.listen(port, () => {
    console.log(`Server is running successfully on this url http://localhost:${port}`)
})