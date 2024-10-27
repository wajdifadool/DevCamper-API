// `
// server.js
const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
// Scurity
const mongoSanitize = require('express-mongo-sanitize')
const helemt = require('helmet')
const xss = require('xss-clean')
var hpp = require('hpp')
const rateLimit = require('express-rate-limit')

// Enable cors
var cors = require('cors')

const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const { initializeFirebase, uploadFile } = require('./config/firebasestorage')
// Routes Files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const fileUpload = require('express-fileupload')
// Load config.env
dotenv.config({ path: './config/config.env' })

//Call the connectDB function
connectDB()

/** FireBase Storage */
initializeFirebase()

// test
// uploadFile('/Users/wajdi/Downloads/IMG_7084.JPG')
/**End of fire base storage config */
const app = express()

// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // To parse URL-encoded bodies

// Dev loging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// File Uploading middleware
app.use(fileUpload())

/* * * * * * *
 * Security  *
 * * * * * * */
// To remove data using these defaults:
app.use(mongoSanitize())

// Help secure Express apps by setting HTTP response headers.
app.use(helemt())

// Prevent xss
app.use(xss())

// https://express-rate-limit.mintlify.app/quickstart/usage#using-the-library
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)
// Prvevent hpp params Poulitoin

// prevent Hpp header polution
app.use(hpp())

// enable CORS (TODO: change just for the  domains)
app.use(cors())

// Set static Folder so we can use the image
app.use(express.static(path.join(__dirname, 'public')))

// cookie Parser
app.use(cookieParser()) // fror sending token beck to the client

// const logger = (req, res, next) => {
//   console.log(`${req.method }`)
// )}
// const logger = (req, res, next) => {

//   req.hello = 'Hello world' /// now we have accsess to .hello in the route in the controller

//   console.log('MiddleWare ran')

//   next() // so it moves to next peace in the cucle
// }

// app.use(logger) // we have accsess to middlware throgh out all routes TODO:bring a looger to log errors
// ----------------
// --------------- ROUTES  -----------
// ----------------
// Mount Router (using it from other file )
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)

// Middleware to parse JSON requests
// app.use(express.json())

// // Get the port and environment from the environment variables
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.get('/', (req, res) => {
  res.status(200)
  res.json({ message: 'Server is alive and kicking . . . . ' })
})

const server = app.listen(PORT, () => {
  console.log(colors.cyan(`Server running in ${NODE_ENV} mode on port ${PORT}`))
})
// handle unhandled promise rejection  (global for promises)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error Connection To database: ${err.message}`.red.underline.bold)
  server.close(() => process.exit(1)) // Exit process with failure
})

/*
This event is triggered when the process is asked to terminate 
such as when the server is stopped or restarted 
(common in production environments like Kubernetes or Docker).
not for my envoirment , nahhh 
*/
// Handle SIGTERM signal to gracefully shut down Firebase connections
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing Firebase connections')

  // Optionally, delete the Firebase app instance to clean up
  admin
    .app()
    .delete()
    .then(() => {
      console.log('Firebase connections closed')
      process.exit(0) // Exit the process once Firebase is cleaned up
    })
    .catch((err) => {
      console.error('Error while closing Firebase connections:', err)
      process.exit(1)
    })
})

// uploadFile('/Users/wajdi/Downloads/IMG_7084.JPG')
