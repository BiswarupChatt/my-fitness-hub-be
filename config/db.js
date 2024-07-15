const mongoose = require('mongoose')

const configureDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to MongoDB Atlas Successfully')
    } catch (err) {
        console.log('Error to connect with the database', err)
    }
}

module.exports = configureDB