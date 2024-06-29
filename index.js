require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { checkSchema } = require('express-validator')

const {userRegisterValidations} = require('./app/validations/user-validations')
const userCtrl = require('./app/controllers/user-ctrl')

const configureDB = require('./config/db')

const app = express()
const port = process.env.PORT || 4000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())
 

app.get('/', (req, res)=>{
    res.send('working!')
})

app.post('/users/register', checkSchema(userRegisterValidations), userCtrl.register)


app.listen(port, ()=>{
    console.log(`Server is running successfully on this url http://localhost:${port}`)
})