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
const rateLimit = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('mongo-sanitize');
const xss = require('xss');


const mountRoutes = require('./routes/index')
const {webhookCheckout} = require('./controllers/orderController')
// DB Connection
dbConnection()



// express App
const app = express()


// enable other domains to access api's
app.use(cors())


// compress all responses
app.use(compression())


// Checkout Webhook
app.post('/webhook-checkout', express.raw({type: 'application/json'}), webhookCheckout)

// Middlewares

// set request size limit to 20kb
app.use(express.json({limit: '20kb'}))


// middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({
    // for testing
    whitelist : [ 'price', 'sold', 'quantity', 'ratingsAverage', 'ratingsQuantity']
}))


// Sanitize Data

// prevent scripts
app.use((req, res, next) => {
    if(req.body) {
        for (const key in req.body) {
            if(typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key])
            }
        }
    }
    if (req.query) {
        for (const key in req.query) {
             if (typeof req.query[key] === 'string') {
                req.query[key] = xss(req.query[key]);
            }
        }
    }
    
    next();
})

// to prevent no sql query injection
app.use((req, res, next) => {
    if (req.body) {
        req.body = mongoSanitize(req.body); 
    }
    next();
});

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    message: 'Too Many Requests from this IP, Please try again in 15 minutes',
})


// Apply the rate limiting middleware to all requests.
app.use('/api', limiter)

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