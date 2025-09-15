const express = require('express')
let monuments = require('./monuments-list')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello, Express !')
})

app.get('/monuments/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const monument = monuments.find(m => m.id === id)
    const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
    const data = monument
    res.json({message, data})
})

app.get('/monuments', (req, res) => {
    const message = 'La liste des monuments a bien été récupérée.'
    const data = monuments
    res.json({message, data})
})



app.listen(3000, () => console.log('Server running at http://localhost:3000'))

