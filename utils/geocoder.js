const axios = require('axios')

// Function to get geocoding data
const geocode = async (address) => {
  try {
    const apiKey = process.env.GEOCODE_API_KEY // Use the API key from the environment variable
    const query = `https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`
    const response = await axios.get(query)
    return response.data // Return the full geocoding object
  } catch (error) {
    console.error('Error in geocoding:', error)
    throw error
  }
}

module.exports = geocode
