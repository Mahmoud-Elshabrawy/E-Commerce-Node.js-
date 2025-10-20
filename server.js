const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({path: 'config.env'})
const dbConnection = require('./config/database')
const categoryRoutes = require('./routes/categoryRoutes')

// DB Connection
dbConnection()



// express App
const app = express()



// Middlewares
app.use(express.json())
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    // console.log(`The Current Mode is: ${process.env.NODE_ENV}`);
}


// Routes
app.use('/api/v1/categories', categoryRoutes)


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`App Running on Port ${port}`);
    
})