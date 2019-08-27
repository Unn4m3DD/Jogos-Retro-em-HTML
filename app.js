const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
var pieces = [
  [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[1, 0], [1, 1], [1, 2], [1, 3]],
  ],
  [
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [1, 2], [0, 2]],
    [[2, 1], [1, 1], [0, 1], [0, 0]],
    [[1, 2], [1, 1], [1, 0], [0, 0]],
  ],
  [
    [[0, 1], [1, 1], [2, 1], [2, 0]],
    [[1, 2], [1, 1], [1, 0], [0, 0]],
    [[2, 1], [1, 1], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
  ],
  [
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 2], [1, 1], [2, 1], [2, 0]],
  ],
  [
    [[2, 0], [1, 0], [1, 1], [0, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  [
    [[0, 1], [1, 1], [1, 2], [2, 1]],
    [[0, 1], [1, 1], [1, 2], [1, 0]],
    [[0, 1], [1, 1], [2, 1], [1, 0]],
    [[1, 2], [1, 1], [1, 0], [0, 1]],
  ],
  [
    [[0, 0], [1, 0], [1, 1], [0, 1]],
  ],
]

const width = 20
const height = 20

let board = []
var canRotate = true
log = (text) => { process.stdout.write(text) }

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
  if (key.name === 'w' && canRotate) {
    rotatePiece()
    canRotate = false
    setTimeout(() => { canRotate = true }, 200)
  }
  if (key.name === 'a' && canMove("Left")) {
    move("Left")
  }
  if (key.name === 'd' && canMove("Right")) {
    move("Right")
  }
  if (key.name === 's') {
    logic()
  }

})


render = () => {
  console.log('\033[2J');
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[x][y] == 1 || board[x][y] == 2)
        log("█")
      else
        log(" ")
    }
    console.log()
  }
}
logic = () => {
  if (canMove("Down"))
    move("Down")
  else
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2) {
          board[x][y] = 1;
        }
      }
    }
  let { line, y } = hasLine()
  if (line) deleteLine(y);
  if (!hasPiece()) spawnPiece()
}
deleteLine = (ht) => {
  console.log(ht)
  for (let x = 0; x < width; x++)
    board[x][ht] = 0
  for (let y = ht; y > 0; y--) {
    for (let x = 0; x < width; x++) {
      board[x][y] = board[x][y - 1]
      board[x][y - 1] = 0
    }
  }
}
hasLine = () => {
  for (let y = 0; y < height - 1; y++) {
    let line = true
    for (let x = 0; x < width; x++) {
      line = board[x][y] == 1 && line
    }
    if (line) {
      return { line, y }
    }
  }
  return false
}
setup = () => {
  for (let x = 0; x < width; x++) {
    board.push([])
    for (let y = 0; y < height; y++) {
      if (x == 0 || x == width - 1 || y == height - 1)
        board[x].push(1)
      else
        board[x].push(0)
    }
  }
}
setup()
setInterval(render, 300)
setInterval(logic, 1000)



move = (dir) => {
  if (dir == "Left")
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2) {
          board[x][y] = 0;
          board[x - 1][y] = 2;
        }
      }
    }
  else if (dir == "Right")
    for (let x = width - 1; x >= 0; x--) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2) {
          board[x][y] = 0;
          board[x + 1][y] = 2;
        }
      }
    }
  else if (dir == "Down")
    for (let x = 0; x < width; x++) {
      for (let y = height - 1; y >= 0; y--) {
        if (board[x][y] == 2) {
          board[x][y] = 0;
          board[x][y + 1] = 2;
        }
      }
    }
}


rotatePiece = () => {
  for (let i of pieces) {
    for (let pos = 0; pos < i.length; pos++) {
      let { x, y } = match(i[pos]);
      if (x != null) {
        clearPieces()
        placePiece(i[(pos + 1) % (i.length)], x, y)
        break
      }
    }
  }
}

match = (pc) => {
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      if (board[x][y] == 2) {
        let pts = 0
        for (let i = -1; i < 3; i++) {
          for (let j = -1; j < 3; j++) {
            try {
              if (board[x + i][y + j] == 2 && my_includes(pc, [i + 1, j + 1]))
                pts++
            } catch (e) { }
          }
        }
        if (pts == 4) return { x, y }
      }
    }
  }
  return { x: null, y: null }
}
my_includes = (array, match) => {
  for (let i of array) {
    if (i[0] == match[0] && i[1] == match[1])
      return true
  }
  return false
}
placePiece = (piece, x, y) => {
  for (let i of piece) {
    board[x + i[0]][y + i[1]] = 2
  }
}
clearPieces = () => {
  for (let x = 1; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (board[x][y] == 2)
        board[x][y] = 0
    }
  }
}

spawnPiece = () => {
  let x = Math.round(width / 2)
  let y = 3
  let piece = randomChoice(pieces)
  for (let i of piece[0]) {
    board[x + i[0]][y + i[1]] = 2
  }
}
hasPiece = () => {
  for (let x = 1; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (board[x][y] == 2)
        return true
    }
  }
  return false
}

canMove = (dir) => {
  if (dir == "Left")
    for (let x = 1; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x - 1][y] == 1)
          return false
      }
    }
  else if (dir == "Right")
    for (let x = 0; x < width - 1; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x + 1][y] == 1)
          return false
      }
    }
  else if (dir == "Down")
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x][y + 1] == 1)
          return false
      }
    }
  return true
}



randomChoice = (choices) => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}