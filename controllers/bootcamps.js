// https://expressjs.com/en/guide/error-handling.html
// controllers/bootcamps.js

const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get Bootcamp by ID
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
      )
    }
    return res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    next(error)
    // next(

    //   new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    // )

    // res.status(400).json({
    //   success: false,
    //   message: 'Something went worng ',
    // })
  }
}

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  //   console.log(req.body)

  try {
    const bootcamp = await Bootcamp.create(req.body)
    const id = bootcamp._id

    const message = `Create new  bootcamp ID = ${id}`
    res.status(201).json({
      success: true,
      message: message,
      data: bootcamp,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update Bootcamp by ID
// @route   POST /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
      )
    }
  } catch (error) {
    next(error)
  }
  //
}

// @desc    Delete Bootcamp by ID
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
      )
    }
    return res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

// END OF FILE
