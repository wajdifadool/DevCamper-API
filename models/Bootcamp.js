const mongoose = require('mongoose')
const slugify = require('slugify')
const geocode = require('../utils/geocoder')

const axios = require('axios')
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

//https://mongoosejs.com/docs/middleware.html#types-of-middleware
// Create Bootcamp Slug from the name
// will run before the documnet get saved
BootcampSchema.pre('save', function (next) {
  // we can accses any field using this.
  this.slug = slugify(this.name, { lower: true })
  next() // so it can continue to the next function (creating the object)
})

// TODO:FIX the api works , but im boreeeeed to debuugg
// // Geocode & create location field
// BootcampSchema.pre('save', async function (next) {
//   const loc = await geocode(this.address)

//   this.location = {
//     type: 'Point',
//     coordinates: [loc.data[0].lon, loc.data[0].lat],
//     formattedAddress: loc.data[0].display_name,
//     // street: loc[0].streetName,
//     // city: loc[0].city,
//     // state: loc[0].stateCode,
//     // zipcode: loc[0].zipcode,
//     // country: loc[0].countryCode,
//   }

//   // Do not save address in DB
//   this.address = undefined
//   next()
// })

module.exports = mongoose.model('Bootcamp', BootcampSchema)
