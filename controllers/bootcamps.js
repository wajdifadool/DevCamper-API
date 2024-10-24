// https://expressjs.com/en/guide/error-handling.html
// controllers/bootcamps.js

const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course')
const { uploadFile } = require('../config/firebasestorage')
const asyncHandler = require('../middleware/async')
const path = require('path')

const ErrorResponse = require('../utils/errorResponse')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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

  res.status(200).json({ success: true, data: bootcamp })
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
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    )
  }

  // Cascade delete courses related to the bootcamp
  await bootcamp.deleteOne() // will delete and triger the pre.remove middileware

  res.status(200).json({ success: true, data: {} })
})

// TODO: add image to the bootcamp .43
// @desc    Upload Photo for  Bootcamp by ID
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadImageBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with id of ${req.params.id}`, 404)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`please upload a file`, 400))
  }
  // const filePath = req.file.path // Assuming the file path is available after file upload

  const file = req.files.file

  // filetype
  if (!file.mimetype.startsWith('image/')) {
    return next(new ErrorResponse(`please upload image file`, 400))
  }

  // TODO:file size

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  // process.env.FILE_UPLOAD_PATH TODO: Move to .env
  const filePath = `public/uploads/${file.name}`

  file.mv(filePath, async (err) => {
    if (err) {
      // console.error(`Error Uploading  Image\n${err}`) TODO:LOGGER
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    // now we have the file in the server

    try {
      // Upload to Storage

      const imageUrl = await uploadFile(filePath)
      console.log('image Uploaded to the data base ')
      console.log(imageUrl)

      //  update Botcamp image

      // TODO: DRY, We already found the Bootcamp
      // bootcamp.updateOne({

      // })
      //   // TODO: make sure we can read the image URL
      await Bootcamp.findByIdAndUpdate(
        req.params.id,

        { photo: imageUrl }
      )

      res.status(200).json({
        success: true,
        data: bootcamp,
      })
    } catch (error) {
      return next(new ErrorResponse('Image upload failed', 500))
    }
  })
}) // end of file

// END OF FILE
