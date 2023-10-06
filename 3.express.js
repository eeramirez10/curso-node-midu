const express = require('express')
const app = express()
const ditto = require('./pokemon/ditto.json')

const PORT = process.env.PORT ?? 1234

app.disabled('X-Powered-By')
app.use(express.json())

// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   let body = ''

//   req.on('data', chunk => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)

//     req.body = data

//     next()
//   })
// })

app.get('/pokemon/ditto', (req, res) => {
    return res.json(ditto)
})

app.post('/pokemon', (req, res) => {
    const { body } = req

    res.json(body)
})

app.use((req, res) => {
    res.send('<h1> 404 </h1>')
})

app.listen(PORT, () => {
    console.log(`server listen on port ${PORT}`)
})
