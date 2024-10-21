const http = require('http')
const { todo } = require('node:test')

const todos = [
  { id: 1, text: 'akkde' },
  { id: 2, text: 'akkde' },
  { id: 3, text: 'akkde' },
]
const server = http.createServer((req, res) => {
  const res1 = JSON.stringify({
    data: todos,
  })
  res.end(res1)

  //   we have acsses to the req , the request sent from the user

  let body = []
  req
    .on('data', (chunck) => {
      body.push(chunck)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      console.log(body)
    })
})
//) // when we user res.end() the response will be 200 if there is no errors

const PORT = 5000
server.listen(PORT, () => {
  console.log(`server Runing on port ${PORT}`)
})
