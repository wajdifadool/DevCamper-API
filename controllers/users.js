const crypto = require('crypto')

const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Get All Users
// @route   GET /api/v1/users/
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get single User
// @route   Get /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const UserId = req.params.id
  const user = await User.findById(UserId)

  if (!user) {
    return next(new ErrorResponse(`No User Found with the id ${UserId} `, 404))
  }

  res.status(200).json({
    succses: true,
    data: user,
  })
})

// @desc    Create User
// @route   Post /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const userObject = req.body

  const user = await User.create(userObject)

  res.status(200).json({
    succses: true,
    data: user,
  })
})

// @desc    Update User
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const UserId = req.params.id
  const userObject = req.body
  let user = await User.findById(UserId)

  if (!user) {
    return next(new ErrorResponse(`No User Found with the id ${UserId} `, 404))
  }

  user = await User.findByIdAndUpdate(UserId, userObject, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    succses: true,
    data: user,
  })
})

// @desc    Delete User
// @route   delete /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const UserId = req.params.id

  await User.findByIdAndDelete(UserId)

  res.status(200).json({
    succses: true,
    data: {},
  })
})
