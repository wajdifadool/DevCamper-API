// controllers/bootcamps.js

const Bootcamp = require('../models/Bootcamp')
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
    res.status(400).json({
      success: false,

      message: 'Something went worng ',
    })
  }
}

// @desc    Get Bootcamp by ID
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: 'No bootcamp found',
      })
    }
    return res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Something went worng ',
    })
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
    res.status(400).json({
      success: false,
      message: 'Something went worng ',
    })
  }
}

// @desc    Update Bootcamp by ID
// @route   POST /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    //
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      message: 'No bootcamp found',
    })
  }
  return res.status(200).json({ success: true, data: bootcamp })
}

// @desc    Delete Bootcamp by ID
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: 'No bootcamp found',
      })
    }
    return res.status(200).json({ success: true, data: {} })
  } catch (error) {
    console.log('Error Deleting', err.message)
  }
}

// END OF FILE
