// Each middleware should be runed throgh app.usr in serve js in odrder to use it
const colors = require('colors')
const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
  console.log(err.name)
  let error = { ...err }
  error.message = err.message
  let message = ''
  // Mongoose Bad Object Id

  if (err.name === 'CastError') {
    message = `Resource  Not found with id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
}

module.exports = errorHandler
