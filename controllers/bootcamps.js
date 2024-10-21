// https://expressjs.com/en/guide/error-handling.html
// controllers/bootcamps.js

const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')

const ErrorResponse = require('../utils/errorResponse')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

// @desc    Get Bootcamp by ID
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    )
  }
  return res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //   console.log(req.body)

  const bootcamp = await Bootcamp.create(req.body)
  const id = bootcamp._id

  const message = `Create new  bootcamp ID = ${id}`
  res.status(201).json({
    success: true,
    message: message,
    data: bootcamp,
  })
})

// @desc    Update Bootcamp by ID
// @route   POST /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc    Delete Bootcamp by ID
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    )
  }
  return res.status(200).json({ success: true, data: {} })
})

// END OF FILE
