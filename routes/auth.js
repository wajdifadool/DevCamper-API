const express = require('express')
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  // updatedetails,
} = require('../controllers/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(register)
router.route('/login').get(login)
router.route('/me').get(protect, getMe)
// router.route('/updatedetails').post(protect, updatedetails)
router.route('/forgotpassword').post(forgotPassword)
router.route('/updatePassword').put(protect, updatePassword) // will send token back

router.route('/resetpassword/:resettoken').put(resetPassword)

// router.post('/register', register)

module.exports = router
