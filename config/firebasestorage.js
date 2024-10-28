// firebase.js
const admin = require('firebase-admin')
const path = require('path')

const initializeFirebase = () => {
  // Initialize Firebase Admin SDK

  /** const initBucket= */ admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
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
    console.log(file.publicUrl())
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
