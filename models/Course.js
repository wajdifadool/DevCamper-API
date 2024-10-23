const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

// statics , and methos
// staic called on the actuall model
// Course.goFFish()  // static

// method
// const courses = Course.find()
// courses.goFish()

// https://masteringjs.io/tutorials/mongoose/aggregate
// Static Method to get Average of Course Touition
// CourseSchema.statics.getAverageCost = async function (bootcampId) {
//   console.log('calculating average Cost ')

//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId },
//     },
//     {
//       $group: {
//         _id: '$bootcamp',
//         //

//         averageCost: { $avg: '$tuition' },
//       },
//     },
//   ])

//   // console.log(obj)
//   // { _id: new ObjectId('5d725a037b292f5f8ceff787'), averageCost: 1000 }]

//   // add to the db
//   try {
//     // this.model('Bootcamp') is the same as Doing BootcampSchema
//     await this.model('Bootcamp').findByIdAndUpdate('bootcampId', {
//       averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

// // call getaverageCost after Save
// CourseSchema.post('save', async function () {
//   await this.constructor.getAverageCost(this.bootcamp)
// })

// // call getaverageCost before Remove
// CourseSchema.pre('remove', function () {})

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ])

  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost,
    })
  } catch (err) {
    console.log(err)
  }
}

// Call getAverageCost after save
CourseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost pre remove
// TODO: BUG: its geting called but the getAverageCost didnt update the tuition after deletion !!
CourseSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    // console.log('calling pre 1 ')
    await this.constructor.getAverageCost(this.bootcamp)
    // console.log('calling pre 2 ')
  }
)

module.exports = mongoose.model('Course', CourseSchema)
