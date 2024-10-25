const express = require('express')
const { protect, authorize } = require('../middleware/auth')

// https://www.npmjs.com/package/router
const router = express.Router({
  mergeParams: true,
})

const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourseById,
  deleteCourseById,
} = require('../controllers/courses')
const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')
//
//

router.route('/').get(
  advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
)
router.route('/').post(protect, authorize('publisher', 'admin'), addCourse)

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('publisher', 'admin'), updateCourseById)
  .delete(protect, authorize('publisher', 'admin'), deleteCourseById)

// router
//   .route('/:id')
//   .get(getBootcampById)
//   .put(updateBootcampById)
//   .delete(deleteBootcampById)

// Route to create a bootcamp
// router.post('/', createBootcamp )

// // Route to get all bootcamps
// router.get('/', getBootcamps)

// // Route to get a bootcamp by ID
// router.get('/:id', getBootcampById)

// // Route to update a bootcamp by ID
// router.put('/:id', updateBootcampById)

// // Route to delete a bootcamp by ID
// router.delete('/:id', deleteBootcampById)

module.exports = router
