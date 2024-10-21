// `
// server.js
const express = require('express')
// const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Routes Files
const bootcamps = require('./routes/bootcamps')
// Load config.env
dotenv.config({ path: './config/config.env' })

//Call the connectDB function
connectDB()

const app = express()

// Body Parser
app.use(express.json())
// Dev loging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// const logger = (req, res, next) => {
//   console.log(`${req.method }`)
// )}
// const logger = (req, res, next) => {

//   req.hello = 'Hello world' /// now we have accsess to .hello in the route in the controller

//   console.log('MiddleWare ran')

//   next() // so it moves to next peace in the cucle
// }

// app.use(logger) // we have accsess to middlware throgh out all routes

// Mount Router (using it from other file )
app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler)

// Middleware to parse JSON requests
// app.use(express.json());

// // Get the port and environment from the environment variables
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// ----------------
// --------------- Bootcamps -----------
// ----------------
app.get('/', (req, res) => {
  res.status(200)
  res.json({ message: 'Live and kicking' })
})

const server = app.listen(PORT, () => {
  console.log(colors.cyan(`Server running in ${NODE_ENV} mode on port ${PORT}`))
})
// handle unhandled promise rejection  (global for promises)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error Connection To database: ${err.message}`.red.underline.bold)
  server.close(() => process.exit(1)) // Exit process with failure
})
