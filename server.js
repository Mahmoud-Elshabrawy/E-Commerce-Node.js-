const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({path: 'config.env'})
const dbConnection = require('./config/database')
const GlobalError = require('./middlewares/globalError')
const AppError = require('./utils/appError')
const categoryRoutes = require('./routes/categoryRoutes')
const subCategoryRoutes = require('./routes/subCategoryRoutes')
const brandRoutes = require('./routes/brandRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

// DB Connection
dbConnection()



// express App
const app = express()



// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    // console.log(`The Current Mode is: ${process.env.NODE_ENV}`);
}


// Routes
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/subcategories', subCategoryRoutes)
app.use('/api/v1/brands', brandRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)

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