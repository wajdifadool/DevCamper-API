// https://expressjs.com/en/guide/error-handling.html
// controllers/courses.js

const Course = require('../models/Course')
const asyncHandler = require('../middleware/async')

const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all Courses
// @desc    Get all Courses for a bootcamp
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query
  // check if params have  bootcampId
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

/**
 * The :id part is a route parameter.
 * This means that when a request is made to
 * a URL like /api/v1/bootcamps/5d713995b721c3bb38c1f5d0,
 * Express automatically maps the portion after /bootcamps/
 *  to the parameter name id./
 */
// @desc    Get Course by ID
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    //
    path: 'bootcamp',
    select: 'name description',
  })

  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with id of ${req.params.id}`, 404)
    )
  }
  return res.status(200).json({ success: true, data: course })
})

// @desc    Add  Courses for a bootcamp,  Must Providethe bootcampID
// @route   Post /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  // Check for the bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`BootCamp Not found with id of ${req.params.id}`, 400)
    )
  }
  const course = await Course.create(req.body)

  const id = course._id

  const message = `Create new  Course at ID = ${id}.`

  res.status(200).json({
    success: true,
    message: message,
    data: course,
  })
})

// @desc    Update Course by ID
// @route   POST /api/v1/courses/:id
// @access  Private
exports.updateCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc    Delete Bootcamp by ID
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`Course Not found with id of ${req.params.id}`, 404)
    )
  }

  return res.status(200).json({ success: true, data: {} })
})

// END OF FILE
