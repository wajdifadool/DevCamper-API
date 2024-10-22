// https://expressjs.com/en/guide/error-handling.html
// controllers/bootcamps.js

const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')

const ErrorResponse = require('../utils/errorResponse')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query }

  const removeFileds = ['select', 'sort', 'page', 'limit']

  removeFileds.forEach((param) => {
    delete reqQuery[param]
  })
  let queryString = JSON.stringify(reqQuery)

  queryString = queryString.replace(
    /\b(gt|gte|eq|lte|lt|in)\b/g,
    (match) => `$${match}`
  )
  let query = Bootcamp.find(JSON.parse(queryString))

  // get the select  fileds
  //https://mongoosejs.com/docs/queries.html#executing
  if (req.query.select) {
    const fileds = req.query.select.split(',').join(' ')
    query = query.select(fileds)
  }

  // either its  sorted by givne param or  set it by date as default
  if (req.query.select) {
    const sortBy = req.query.select.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments() // the while bootcamp in the DB

  console.log(total, page, limit, startIndex, endIndex)

  // Quering
  query = query.skip(startIndex).limit(limit)

  // Call the DB HERE
  const bootcamps = await query

  // Pagination result we  added to the response
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    }
  }

  res.status(200).json({
    pagination: pagination,
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

/**
 * The :id part is a route parameter.
 * This means that when a request is made to
 * a URL like /api/v1/bootcamps/5d713995b721c3bb38c1f5d0,
 * Express automatically maps the portion after /bootcamps/
 *  to the parameter name id./
 */
// @desc    Get Bootcamp by ID
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  console.log(req.params.id)
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
