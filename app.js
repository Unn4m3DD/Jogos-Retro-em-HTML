const express = require('express')
const app = express()
const port = 3000
var path = require('path');

app.get('/', (req, res) => res.sendFile(
    path.join(__dirname + '/landing_page.html')
))
app.get('/tetris', (req, res) => res.sendFile(

    path.join(__dirname + '/Tetris/tetris_mark_2_aio.html'))
)
app.get('/', (req, res) => res.sendFile(
    path.join(__dirname + '/minesweeper_mark_1_aio.html')
))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))