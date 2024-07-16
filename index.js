require('dotenv').config()

const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const { checkSchema } = require('express-validator')

const userCtrl = require('./app/controllers/user-ctrl')
const coachCtrl = require('./app/controllers/coach-ctrl')
const clientCtrl = require('./app/controllers/client-ctrl')
const questionCtrl = require('./app/controllers/question-ctrl')
const answerCtrl = require('./app/controllers/answer-ctrl')
const workoutCtrl = require('./app/controllers/workout-ctrl')
const foodItemCtrl = require('./app/controllers/foodItem-ctrl')
const trainingPlanCtrl = require('./app/controllers/trainingPlan-ctrl')
const nutritionPlanCtrl = require('./app/controllers/nutritionPlan-ctrl')
const progressCtrl = require('./app/controllers/progress-ctrl')

const { userRegisterValidations, userUpdateValidation, userLoginValidations, userForgetPasswordValidation, resetPasswordValidations } = require('./app/validations/user-validations')
const { coachUpdateValidation } = require('./app/validations/coach-validations')
const { clientUpdateValidations } = require('./app/validations/client-validations')
const { questionValidation } = require('./app/validations/question-validations')
const { answerValidations, answerUpdateValidations } = require('./app/validations/answer-validations')
const { workoutValidation } = require('./app/validations/workout-validations')
const { foodItemValidation } = require('./app/validations/foodItem-validation')
const { trainingPlanValidations, workoutSessionValidation } = require('./app/validations/trainingPlan-validations')
const { nutritionPlanValidation, mealPlansValidations } = require('./app/validations/nutritionPlan-validation')
const { progressValidation, progressUpdateValidation } = require('./app/validations/progress-validations')

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
//todo replace coachId with jwt token
app.post('/users/register/client/:coachId', checkSchema(userRegisterValidations), userCtrl.clientRegister)
app.post('/users/forgetPassword', checkSchema(userForgetPasswordValidation), userCtrl.forgetPassword)
app.post('/users/resetPassword/:token', checkSchema(resetPasswordValidations), userCtrl.resetPassword)
app.put('/users/profileImageUpdate', authenticateUser, upload.single('profileImage'), userCtrl.profileImageUpdate)


app.get('/coach', authenticateUser, authorizeUser(['coach']), coachCtrl.getMy)
app.put('/coach', authenticateUser, authorizeUser(['coach']), checkSchema(coachUpdateValidation), coachCtrl.update)
app.get('/coach/getAllClient', authenticateUser, authorizeUser(['coach']), coachCtrl.getAllCLient)
app.get('/coach/getSingleCLient/:userId', authenticateUser, authorizeUser(['coach']), coachCtrl.getSingleCLient)
app.put('/coach/verification', authenticateUser, authorizeUser(['admin']), coachCtrl.verification)
//todo send invitation email to client


app.put('/client', authenticateUser, authorizeUser(['client']), checkSchema(clientUpdateValidations), clientCtrl.update)
app.get('/client', authenticateUser, authorizeUser(['client']), clientCtrl.getMy)


app.post('/question', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.create)
///todo combine both the get method
app.get('/question', authenticateUser, questionCtrl.getDefault)
app.get('/question/:coachId', authenticateUser, questionCtrl.get)
app.put('/question/:_id', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.update)
app.delete('/question/:_id', authenticateUser, authorizeUser(['coach', "admin"]), checkSchema(questionValidation), questionCtrl.delete)


app.post('/answer', authenticateUser, authorizeUser(['client']), checkSchema(answerValidations), answerCtrl.create)
//todo combine both the get method
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
app.put('/training-plan/:clientId/updateAdditionalNotes', authenticateUser, authorizeUser(['coach', 'admin']), trainingPlanCtrl.updateAdditionalNotes)
app.post('/training-plan/:clientId/addWorkoutSession', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(workoutSessionValidation), trainingPlanCtrl.addWorkoutSession)
app.put('/training-plan/:clientId/updateWorkoutSession/:workoutSessionId', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(workoutSessionValidation), trainingPlanCtrl.updateWorkoutSession)
app.delete('/training-plan/:clientId/deleteWorkoutSession/:workoutSessionId', authenticateUser, authorizeUser(['coach', 'admin']), trainingPlanCtrl.deleteWorkoutSession)


app.post('/progress', authenticateUser, authorizeUser(['client']), checkSchema(progressValidation), progressCtrl.create)
app.get('/progress/:clientId?', authenticateUser, progressCtrl.get)
app.put('/progress/:_id', authenticateUser, authorizeUser(['client']), checkSchema(progressUpdateValidation), progressCtrl.update)
app.delete('/progress/:_id', authenticateUser, authorizeUser(['client']), progressCtrl.delete)


app.post('/food-item', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(foodItemValidation), foodItemCtrl.create)
app.get('/food-item/:coachId?', authenticateUser, foodItemCtrl.get)
app.put('/food-item/:_id', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(foodItemValidation), foodItemCtrl.update)
app.delete('/food-item/:_id', authenticateUser, authorizeUser(['coach', 'admin']), foodItemCtrl.delete)


app.post('/nutrition-plan/:clientId', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(nutritionPlanValidation), nutritionPlanCtrl.create)
app.get('/nutrition-plan/:clientId?', authenticateUser, nutritionPlanCtrl.get)
app.put('/nutrition-plan/:clientId/updateAdditionalNotes', authenticateUser, authorizeUser(['coach', 'admin']), nutritionPlanCtrl.updateAdditionalNotes)
app.post('/nutrition-plan/:clientId/addMealPlan', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(mealPlansValidations), nutritionPlanCtrl.addMealPlans)
app.put('/nutrition-plan/:clientId/updateMealPlan/:mealPlansId', authenticateUser, authorizeUser(['coach', 'admin']), checkSchema(mealPlansValidations), nutritionPlanCtrl.updateMealPlans)


app.listen(port, () => {
    console.log(`Server is running successfully on this url http://localhost:${port}`)
})