const express = require('express')
// https://www.npmjs.com/package/router
const router = express.Router()

const {
  createBootcamp,
  getBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
  uploadImageBootcamp,
} = require('../controllers/bootcamps')

// Include Other resource Router
const courseRouter = require('./courses')
// Re-route into other resource routers
/**
 * So it's basically going to pass it on to the
 * course router rather than call getCourses from here
 * Example:
 *  calling www.domain.com/bootcamps:bootcampId/courses
 *  will fire on courseRouter
 *  at the Endpoint "/" at-> router.route('/').get(getCourses)
 *  also  made sure in the router/courses.js
 * read this: https://expressjs.com/en/guide/routing.html
 */

router.use('/:bootcampId/courses', courseRouter)

router
  .route('/')
  //
  .get(getBootcamps)
  .post(createBootcamp)

router
  .route('/:id')
  .get(getBootcampById)
  .put(updateBootcampById)
  .delete(deleteBootcampById)

router.route('/:id/photo').put(uploadImageBootcamp)

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
