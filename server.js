const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({path: 'config.env'})
const dbConnection = require('./config/database')
const GlobalError = require('./middlewares/globalError')
const AppError = require('./utils/appError')

const cors = require('cors')
const compression = require('compression')

const mountRoutes = require('./routes/index')

// DB Connection
dbConnection()



// express App
const app = express()


// enable other domains to access api's
app.use(cors())


// compress all responses
app.use(compression())


// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    // console.log(`The Current Mode is: ${process.env.NODE_ENV}`);
}


// Routes
mountRoutes(app)

app.use((req, res, next) => {
    next(new AppError(`Can\'t find this route: ${req.originalUrl}`, 400))
})


//! Global Error Middleware
app.use(GlobalError)


const port = process.env.PORT || 8000
const server = app.listen(port, () => {
    console.log(`App Running on Port ${port}`);
    console.log("Running mode:", process.env.NODE_ENV);
})

// handle Rejection outside express
process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection Errors: ${err}`);
    server.close(() => {
        process.exit(1)
    })
})