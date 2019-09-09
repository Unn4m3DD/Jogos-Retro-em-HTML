var pieces = [
  {
    dimensions: 4,
    forms: [[[1, 1], [0, 1], [2, 1], [3, 1]], [[1, 1], [1, 0], [1, 2], [1, 3]]] //tetris
  },
  {
    dimensions: 2,
    forms: [[[0, 0], [1, 0], [1, 1], [0, 1]]] // quadrado
  },
  {
    dimensions: 3,
    forms: [
      [[1, 1], [0, 2], [0, 1], [2, 1]],
      [[1, 1], [1, 2], [0, 0], [1, 0]],
      [[1, 1], [0, 1], [2, 1], [2, 0]],
      [[1, 1], [1, 0], [1, 2], [2, 2]]
    ] // J
  },
  {
    dimensions: 3,
    forms: [
      [[1, 1], [0, 1], [2, 1], [2, 2]],
      [[1, 1], [1, 0], [1, 2], [0, 2]],
      [[1, 1], [0, 1], [2, 1], [0, 0]],
      [[1, 1], [1, 0], [1, 2], [2, 0]]
    ] // L
  },
  {
    dimensions: 3,
    forms: [[[1, 1], [0, 1], [1, 2], [2, 2]], [[1, 1], [1, 2], [2, 1], [2, 0]]] // __--
  },
  {
    dimensions: 3,
    forms: [[[1, 1], [0, 2], [1, 2], [2, 1]], [[1, 1], [1, 0], [2, 1], [2, 2]]] // --__
  },
  {
    dimensions: 3,
    forms: [
      [[1, 1], [0, 1], [1, 2], [2, 1]],
      [[1, 1], [1, 0], [0, 1], [1, 2]],
      [[1, 1], [0, 1], [2, 1], [1, 0]],
      [[1, 1], [1, 0], [1, 2], [2, 1]]
    ] // T
  }
];

const width = 12;
const height = 20;
randomChoice = choices => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
};
var c_piece = {
  piece: randomChoice(pieces),
  location: { x: Math.round(width / 2), y: 3 },
  phase: 0
};

let board = [];
var canRotateInput = true;

document.onkeypress = event => {
  if (event.keyCode == 119 && canRotateInput) {
    rotatePiece();
    canRotateInput = false;
    setTimeout(() => {
      canRotateInput = true;
    }, 100);
  }
  if (event.keyCode == 97 && canMove("Left")) {
    move("Left");
  }
  if (event.keyCode == 100 && canMove("Right")) {
    move("Right");
  }
  if (event.keyCode == 115) {
    logic();
  }
};

logic = () => {
  if (canMove("Down")) move("Down");
  else
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2) {
          board[x][y] = 1;
        }
      }
    }
  let { line, y } = hasLine();
  if (line) deleteLine(y);
  if (!hasPiece()) spawnPiece();
};
deleteLine = ht => {
  //for (let x = 0; x < width; x++) board[x][ht] = 0;
  for (let y = ht; y > 0; y--) {
    for (let x = 0; x < width; x++) {
      board[x][y] = board[x][y - 1];
      board[x][y - 1] = 0;
    }
  }
  board[0][0] = 1;
  board[width - 1][0] = 1;
};
hasLine = () => {
  for (let y = 0; y < height - 1; y++) {
    let line = true;
    for (let x = 0; x < width; x++) {
      line = board[x][y] == 1 && line;
    }
    if (line) {
      return { line, y };
    }
  }
  return false;
};
setup = () => {
  for (let x = 0; x < width; x++) {
    board.push([]);
    for (let y = 0; y < height; y++) {
      if (x == 0 || x == width - 1 || y == height - 1) board[x].push(1);
      else board[x].push(0);
    }
  }
};

setup();
setInterval(render, 20);
setInterval(logic, 1000);

move = dir => {
  if (dir == "Left") {
    clearPiece();
    c_piece.location = { x: c_piece.location.x - 1, y: c_piece.location.y };
    placePiece();
  } else if (dir == "Right") {
    clearPiece();
    c_piece.location = { x: c_piece.location.x + 1, y: c_piece.location.y };
    placePiece();
  } else if (dir == "Down") {
    clearPiece();
    c_piece.location = { x: c_piece.location.x, y: c_piece.location.y + 1 };
    placePiece();
  }
};

rotatePiece = () => {
  if (canRotate()) {
    c_piece.phase = (c_piece.phase + 1) % c_piece.piece.forms.length;
    clearPiece();
    placePiece();
  }
};

canRotate = () => {
  let start = { x: c_piece.location.x, y: c_piece.location.y };
  let end = {
    x: c_piece.location.x + c_piece.piece.dimensions,
    y: c_piece.location.y + c_piece.piece.dimensions
  };
  for (let x = start.x; x < end.x; x++) {
    for (let y = start.y; y < end.y; y++) {
      try {
        if (board[x][y] == 1) return false;
      } catch {}
    }
  }
  return canRotateInput;
};

placePiece = () => {
  for (let i of c_piece.piece.forms[c_piece.phase]) {
    board[c_piece.location.x + i[0]][c_piece.location.y + i[1]] = 2;
  }
};
clearPiece = () => {
  let start = { x: c_piece.location.x, y: c_piece.location.y };
  let end = { x: c_piece.location.x + 5, y: c_piece.location.y + 5 };
  for (let x = start.x; x < end.x; x++) {
    for (let y = start.y; y < end.y; y++) {
      try {
        if (board[x][y] == 2) board[x][y] = 0;
      } catch {}
    }
  }
};

spawnPiece = () => {
  c_piece = {
    piece: randomChoice(pieces),
    location: { x: Math.round(width / 2), y: 0 },
    phase: 0
  };
};
hasPiece = () => {
  for (let x = 1; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (board[x][y] == 2) return true;
    }
  }
  return false;
};

canMove = dir => {
  if (dir == "Left")
    for (let x = 1; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x - 1][y] == 1) return false;
      }
    }
  else if (dir == "Right")
    for (let x = 0; x < width - 1; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x + 1][y] == 1) return false;
      }
    }
  else if (dir == "Down")
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (board[x][y] == 2 && board[x][y + 1] == 1) return false;
      }
    }
  return true;
};
