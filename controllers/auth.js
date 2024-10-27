const Bootcamp = require('../models/Bootcamp')
const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
// @desc    Register User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Create user
  const user = await User.create({
    name,
    email,
    password, // the passeord is hashed with pre middleware
    role,
  })

  sendTokenResponse(user, 200, res)

  //   // grab token and send to email
  //   const confirmEmailToken = user.generateEmailConfirmToken()

  //   // Create reset url
  //   const confirmEmailURL = `${req.protocol}://${req.get(
  //     'host'
  //   )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`

  //   const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`

  //   user.save({ validateBeforeSave: false })

  //   const sendResult = await sendEmail({
  //     email: user.email,
  //     subject: 'Email confirmation token',
  //     message,
  //   })

  //   sendTokenResponse(user, 200, res)

  //   res.status(200).json({
  //     mesaage: 'register User goes here s',
  //   })
})

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password')

  // we get the user with email and encrypted password from the User

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Check if password matches
  // this call is in the Schema Using model Method
  // password = enteredPassword
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  sendTokenResponse(user, 200, res)
})

// Get token from model, create Cookie ans sed respinse
const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}

// @desc    Get current logged in user
// @route   PSOT /api/v1/auth/me
// @access  Pirvate
exports.getMe = asyncHandler(async (req, res, next) => {
  const { id } = req.user
  const user = await User.findById(id)

  res.status(200).json({
    data: user,
    succsess: true,
  })
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  // TODO: Change the res string
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save(
    //
    { validateBeforeSave: false }
  )

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400))
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc    Update User
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user.id

  const user = await User.findById(userId).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Worng Original password ', 400))
  }

  // the user objet from DataBase
  user.password = req.body.newPassword

  await user.save()

  sendTokenResponse(user, 200, res)

  res.status(200).json({
    succses: true,
    data: user,
  })
})

// @desc    Get current logged in user
// @route   PSOT /api/v1/auth/me
// @access  Pirvate
exports.getMe = asyncHandler(async (req, res, next) => {
  const { id } = req.user
  const user = await User.findById(id)

  res.status(200).json({
    data: user,
    succsess: true,
  })
})

// http://localhost:5000/api/v1/auth/resetpassword/1d8b8c10a40ea1456e0e7b22494210f13e9a0f7a
