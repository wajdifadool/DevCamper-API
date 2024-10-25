const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// Protect routes
// Protecting:

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
    // Set token from cookie
  }
  //   For deploymnet only
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    // Verify token with JWT_SECRET
    // jwt.verify(): This checks the token and verifies its authenticity. If the token is invalid, this function throws an error, which is caught in the catch block, resulting in a 401 error being sent to the user.
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)

    // Attach the user to the request object, now accessible in all protected routes
    req.user = user

    if (!user) {
      return next(new ErrorResponse('Not authorized, user not found', 401))
    }

    // Call `next()` to pass control to the next middleware/handler in the stack
    next()
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      )
    }
    next()
  }
}
