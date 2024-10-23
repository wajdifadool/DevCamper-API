// firebase.js
const admin = require('firebase-admin')
const path = require('path')

// Load the Firebase service account key TODO: maby hide the file params on deploy
const serviceAccount = require('../devcamper-api-4dc84-firebase-adminsdk-jkmf7-f4ec10919c.json')

const initializeFirebase = () => {
  // Initialize Firebase Admin SDK

  /** const initBucket= */ admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
  console.log('🔥 Firebase has been initialized 🔥 '.red.bold)

  // Get a reference to the storage bucket
  return admin.storage().bucket()
  //   console.log(initBucket) //TODO: Security handling
}

// Function to upload file to Firebase Storage
const uploadFile = async (filePath) => {
  const bucket = admin.storage().bucket()
  const fileName = path.basename(filePath)

  try {
    const [file] = await bucket.upload(filePath, {
      destination: `uploads/${fileName}`, // Set the destination in the bucket
    })
    console.log(`File ${fileName} uploaded successfully.`)
    return file.publicUrl() // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('File upload failed.')
  }
}

module.exports = { initializeFirebase, uploadFile }

//TODO: move to Routes:
// Optional: If you want to use this to upload a file in the future
// module.exports.uploadFile = (filePath) => {
//   return bucket.upload(filePath, {
//     destination: path.basename(filePath),
//   })
// }
