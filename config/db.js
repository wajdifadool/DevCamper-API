// server.js

const colors = require('colors')
const mongoose = require('mongoose')

// Connect to MongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)

  console.log('---\t \t\t --- \t\t\t--'.green)
  console.log(
    colors.bgBrightGreen(
      `MongoDB connected: 🍃 ${conn.connection.host} 🍃 `.bold
    )
  )
  console.log('---\t \t\t --- \t\t\t--'.green)

  //try and catch are no more needed

  //  Moved  to server.js for handling prmises
  //   try {
  //     const conn = await mongoose.connect(process.env.MONGO_URI)
  //     console.log(
  //       colors.bgBrightGreen(`MongoDB connected: ${conn.connection.host}`.bold)
  //     )
  //   } catch (err) {
  //     console.error(`Error: ${err.message}`)
  //     process.exit(1) // Exit process with failure
  //   }
}

module.exports = connectDB
