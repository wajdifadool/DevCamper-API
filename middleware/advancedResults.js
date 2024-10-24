const advancedResults = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query }

  const removeFileds = ['select', 'sort', 'page', 'limit']

  removeFileds.forEach((param) => {
    delete reqQuery[param]
  })
  let queryString = JSON.stringify(reqQuery)

  queryString = queryString.replace(
    /\b(gt|gte|eq|lte|lt|in)\b/g,
    (match) => `$${match}`
  )
  let query = model.find(JSON.parse(queryString))

  // get the select  fileds
  //https://mongoosejs.com/docs/queries.html#executing
  if (req.query.select) {
    const fileds = req.query.select.split(',').join(' ')
    query = query.select(fileds)
  }

  // either its  sorted by givne param or  set it by date as default
  if (req.query.select) {
    const sortBy = req.query.select.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments() // the while bootcamp in the DB

  console.log(total, page, limit, startIndex, endIndex)

  // Quering
  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  // Call the DB HERE
  const results = await query

  // Pagination result we  added to the response
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    }
  }

  res.advancedResults = {
    pagination: pagination,
    success: true,
    count: results.length,
    data: results,
  }

  next()
}
module.exports = advancedResults
