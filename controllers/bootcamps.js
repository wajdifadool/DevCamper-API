// controllers/bootcamps.js

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.json({
    message: 'Show all bootcmps',
    hello: req.hello,
  })
}

// @desc    Get Bootcamp by ID
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = (req, res, next) => {
  let id = req.params.id
  res.json(`get bootcamp ID = ${id}`)
}

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps/:id
// @access  Private
exports.createBootcamp = (req, res, next) => {
  let id = req.params.id
  res.json(`Create new  bootcamp ID = ${id}`)
}

// @desc    Update Bootcamp by ID
// @route   POST /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = (req, res, next) => {
  let id = req.params.id
  res.json(`Update bootcamp ID = ${id}`)
}

// @desc    Delete Bootcamp by ID
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcampById = (req, res, next) => {
  let id = req.params.id
  res.json(`Delete bootcamp ID = ${id}`)
}

// END OF FILE
