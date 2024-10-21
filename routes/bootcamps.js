const express = require('express')
// https://www.npmjs.com/package/router
const router = express.Router()

const {
  createBootcamp,
  getBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
} = require('../controllers/bootcamps')

router
  .route('/')
  //
  .get(getBootcamps)
  .post(createBootcamp)

router
  .route('/:id')
  //
  .get(getBootcampById)
  .post(createBootcamp)
  .put(updateBootcampById)
  .delete(deleteBootcampById)

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
