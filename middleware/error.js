// Each middleware should be runed throgh app.usr in serve js in odrder to use it
const colors = require('colors')
const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message
  let message = ''
  // Mongoose Bad Object Id

  if (err.name === 'CastError') {
    message = `Resource  Not found with id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  //   Momgoose  duplicate key
  if (err.code === 11000) {
    message = 'duplicate Name fieldd value error for the name'
    error = new ErrorResponse(message, 400)
  }

  //   Momgoose  validtaion error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message)

    error = new ErrorResponse(message, 400)
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
  // TODO:ADD looger for finding the error
}

module.exports = errorHandler
