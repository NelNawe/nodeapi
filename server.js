const express = require('express')
let monuments = require('./monuments-list')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello, Express !')
})

app.get('/monument/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const monument = monuments.find(m => m.id === id)
    res.send(`${monument.name}`)
})


app.listen(3000, () => console.log('Server running at http://localhost:3000'))

