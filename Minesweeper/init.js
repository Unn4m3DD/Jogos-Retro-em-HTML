const width = Math.round(window.innerWidth / 35);
const height = Math.round(window.innerHeight / 40);
let numberOfBombs = Math.round((width * height) / 8);
let board = [];
let bombBoard = [];
let flags_board = [];
var bombCount = numberOfBombs;
let setup = () => {
  for (let x = 0; x < width; x++) {
    board.push([]);
    bombBoard.push([]);
    flags_board.push([]);
    for (let y = 0; y < height; y++) {
      board[x].push(0);
      bombBoard[x].push(0);
      flags_board[x].push(0);
    }
  }
  while (c_nBombs() < numberOfBombs) {
    placeBomb();
  }
  calculateNumbers();
  render();

};
setup();
function randomOpen() {
  let x = getRandomInt(0, width);
  let y = getRandomInt(0, height);
  while (bombBoard[x][y] == -1 || board[x][y] == 1) {
    x = getRandomInt(0, width);
    y = getRandomInt(0, height);
  }
  open(x, y);
  render();
}
function clicked(x, y, event, clickType) {
  event.preventDefault();
  if (clickType == "l") open(x, y);
  else flag(x, y);
  testWin();
  render();
}
function testWin() {
  if (bombCount == 0) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (bombBoard[x][y] != -1 && flags_board[x][y] != 1) {
          alert("wrong flags");
          return false;
        }
      }
    }
    alert("Nice!");
    return true
  }
  return false
}
function flag(x, y) {
  flags_board[x][y] = (flags_board[x][y] + 1) % 2;
  if (flags_board[x][y] == 1) bombCount--;
  else bombCount++;
}
function open(x, y) {
  if (board[x][y] == 1) return;
  board[x][y] = 1;
  if (bombBoard[x][y] != 0) return;
  for (let i = x - 1; i < x + 2; i++) {
    for (let j = y - 1; j < y + 2; j++) {
      try {
        open(i, j);
      } catch (e) {}
    }
  }
}

function calculateNumbers() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (bombBoard[x][y] != -1) {
        let number = 0;
        for (let i = x - 1; i < x + 2; i++) {
          for (let j = y - 1; j < y + 2; j++) {
            try {
              if (bombBoard[i][j] == -1) number++;
            } catch (e) {}
          }
        }
        bombBoard[x][y] = number;
      }
    }
  }
}

function placeBomb() {
  bombBoard[getRandomInt(0, width)][getRandomInt(0, height)] = -1;
}
function c_nBombs() {
  let result = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (bombBoard[x][y] == -1) result++;
    }
  }
  return result;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
