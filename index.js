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
app.get('/minesweeper', (req, res) => res.sendFile(
    path.join(__dirname + '/Minesweeper/minesweeper_mark_1_aio.html')
))

app.get('/jogodosreflexos', (req, res) => res.sendFile(
    path.join(__dirname + '/jogodosreflexos.html')
))
app.get('/snake', (req, res) => res.sendFile(
    path.join(__dirname + '/snake.html')
))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))