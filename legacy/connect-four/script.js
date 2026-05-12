const ROWS = 6;
const COLS = 7;

const boardEl = document.getElementById("board");
const controlsEl = document.getElementById("columnControls");
const currentPlayerEl = document.getElementById("currentPlayer");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = [];
let currentPlayer = 1;
let gameOver = false;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function cellId(row, col) {
  return `cell-${row}-${col}`;
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = cellId(row, col);
      if (board[row][col] === 1) {
        cell.classList.add("p1");
      } else if (board[row][col] === 2) {
        cell.classList.add("p2");
      }
      boardEl.appendChild(cell);
    }
  }
}

function updateCurrentPlayerLabel() {
  currentPlayerEl.textContent = currentPlayer === 1 ? "Player 1 (Red)" : "Player 2 (Yellow)";
}

function setupControls() {
  controlsEl.innerHTML = "";
  for (let col = 0; col < COLS; col += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "drop-btn";
    button.textContent = "Drop";
    button.addEventListener("click", () => dropDisc(col));
    controlsEl.appendChild(button);
  }
}

function disableControls() {
  controlsEl.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
}

function checkDirection(row, col, dr, dc) {
  const player = board[row][col];
  if (!player) {
    return false;
  }

  let count = 1;
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
    count += 1;
    r += dr;
    c += dc;
  }

  r = row - dr;
  c = col - dc;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
    count += 1;
    r -= dr;
    c -= dc;
  }

  return count >= 4;
}

function hasWinner(row, col) {
  return (
    checkDirection(row, col, 1, 0) ||
    checkDirection(row, col, 0, 1) ||
    checkDirection(row, col, 1, 1) ||
    checkDirection(row, col, 1, -1)
  );
}

function boardFull() {
  return board.every((row) => row.every((cell) => cell !== 0));
}

function dropDisc(col) {
  if (gameOver) {
    return;
  }

  let targetRow = -1;
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === 0) {
      targetRow = row;
      break;
    }
  }

  if (targetRow === -1) {
    statusEl.textContent = "That column is full. Choose another one.";
    return;
  }

  board[targetRow][col] = currentPlayer;
  renderBoard();

  if (hasWinner(targetRow, col)) {
    gameOver = true;
    statusEl.textContent = currentPlayer === 1 ? "Player 1 wins." : "Player 2 wins.";
    disableControls();
    return;
  }

  if (boardFull()) {
    gameOver = true;
    statusEl.textContent = "Match ended in a draw.";
    disableControls();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateCurrentPlayerLabel();
  statusEl.textContent = "Keep going.";
}

function resetGame() {
  board = createBoard();
  currentPlayer = 1;
  gameOver = false;
  setupControls();
  renderBoard();
  updateCurrentPlayerLabel();
  statusEl.textContent = "Drop a disc to start.";
}

resetBtn.addEventListener("click", resetGame);
resetGame();
