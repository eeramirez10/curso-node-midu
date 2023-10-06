const http = require('node:http')

const desiredPort = process.env.PORT ?? 1234

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('hola mundo')
})

server.listen(desiredPort, () => {
  console.log(`server listening on port http://localhost:${desiredPort}`)
})
