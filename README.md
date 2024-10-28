# DevCamper API

## Description

- This project is a full RESTful API built using
  **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

- The API provides the ability to perform CRUD operations on data stored in a MongoDB database.

- Full CRUD functionality for managing resources

## Motivation

Create the backend for a bootcamp directory website. The frontend/UI will be created by another team

## EndPoints

- See Postman Docs at [API documentation](https://documenter.getpostman.com/view/3905853/2sAY4uBNnX)

## Features

### Bootcamps

- List all bootcamps in the database
  - Pagination
  - Select specific fields in result
  - Limit number of results
  - Filter by fields
- Get single bootcamp
- Create new bootcamp
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only one bootcamp per publisher (admins can create more)
  - Field validation via Mongoose
- Upload a photo for bootcamp
  - Owner only
  - Photo will be uploaded to local filesystem and to firebase storage
- Update bootcamps
  - Owner only
  - Validation on update
- Delete Bootcamp
  - Owner only
- Calculate the average cost of all courses for a bootcamp
- Calculate the average rating from the reviews for a bootcamp

### Courses

- List all courses for bootcamp
- List all courses in general
  - Pagination, filtering, etc
- Get single course
- Create new course
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only the owner or an admin can create a course for a bootcamp
  - Publishers can create multiple courses
- Update course
  - Owner only
- Delete course
  - Owner only

### Reviews

- List all reviews for a bootcamp
- List all reviews in general
  - Pagination, filtering, etc
- Get a single review
- Create a review
  - Authenticated users only
  - Must have the role "user" or "admin" (no publishers)
- Update review
  - Owner only
- Delete review
  - Owner only

### Users & Authentication

- Authentication will be done using JWT/cookies
  - JWT and cookie should expire in 30 days
- User registration
  - Register as a "user" or "publisher"
  - Once registered, a token will be sent along with a cookie (token = xxx)
  - Passwords must be hashed
- User login
  - User can login with email and password
  - Plain text password will compare with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  - Cookie will be sent to set token = none
- Get user
  - Route to get the currently logged in user (via token)
- Password reset (lost password)
  - User can request to reset password
  - A hashed token will be emailed to the users registered email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update user info
  - Authenticated user only
  - Separate route to update password
- User CRUD
  - Admin only
- Users can only be made admin by updating the database field manually

## Security

- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for development)

## Code Related stuff

- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data

### Tech Stack

- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for handling routes and middleware
- **MongoDB**: NoSQL database for storing data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **Postman** (or CLI tools like curl): For testing API requests
-

## Future Improvements

> Firebase for more secure authentication

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wajdifadool/DevCamper-API.git
   ```

2. Install dependencies:

   ```bash
    npm isntall
   ```

3. Create a .env file to store environment variables

   ```bash
    MONGO_URI=
    PORT=

    NODE_ENV=development
    PORT=
    MONGO_URI=
    GEOCODE_API_KEY=
    FIREBASE_STORAGE_BUCKET=
    JWT_SECRET=
    JWT_EXPIRE=
    JWT_COOKIE_EXPIRE=

    SMTP_HOST=
    SMTP_PORT=
    SMTP_EMAIL=
    SMTP_PASSWORD=
    FROM_EMAIL=
    FROM_NAME=


    FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY_ID=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_CLIENT_ID=
    FIREBASE_AUTH_URI=
    FIREBASE_TOKEN_URI=
    FIREBASE_AUTH_PROVIDER_CERT_URL=
    FIREBASE_CLIENT_CERT_URL=
    FIREBASE_UNIVERSE_DOMAIN=

   ```

### Whats in the Box ?

- HTTP Essentials
- Postman Client & Postman Documentation
- RESTful API
- Express Framework
- Routing & Controller Methods
- MongoDB Atlas & Compass Mongoose ODM
- Advanced Query (Pagination, filter, - etc) Models & Relationships

- Middleware (Express & Mongoose)

<!-- - Geocoding -->

- Custom Error Handling

<!-- - User Roles & Permissions -->

- Aggregation

- Photo Upload & Firebbase Storage

- Authentication With JWT & Cookies

<!-- - Emailing Password Reset Tokens -->

- Custom Database Seeder Using JSON

<!-- - Files Password & Token Hashing -->
<!-- - Security: NoSQL Injection, XSS, etc - Creating Documentation -->
<!-- - Deployment With PM2, NGINX, SSL -->
