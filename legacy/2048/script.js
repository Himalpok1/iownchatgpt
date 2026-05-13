const SIZE = 4;
const BEST_KEY = "game_2048_best_score";

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusMessageEl = document.getElementById("statusMessage");
const overlayEl = document.getElementById("overlay");
const overlayTextEl = document.getElementById("overlayText");
const newGameBtn = document.getElementById("newGameBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

let board = [];
let score = 0;
let won = false;
let gameOver = false;
let touchStartX = 0;
let touchStartY = 0;
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function getBestScore() {
  const value = Number(localStorage.getItem(BEST_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function setBestScore(next) {
  localStorage.setItem(BEST_KEY, String(next));
}

function updateScore(nextScore) {
  score = nextScore;
  scoreEl.textContent = String(score);

  const best = getBestScore();
  if (score > best) {
    setBestScore(score);
    bestEl.textContent = String(score);
  }
}

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function getEmptyCells() {
  const cells = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] === 0) {
        cells.push([row, col]);
      }
    }
  }
  return cells;
}

function spawnTile() {
  const empties = getEmptyCells();
  if (!empties.length) {
    return false;
  }

  const [row, col] = empties[Math.floor(Math.random() * empties.length)];
  board[row][col] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function slideValues(values) {
  const compact = values.filter((value) => value !== 0);
  let gained = 0;

  for (let i = 0; i < compact.length - 1; i += 1) {
    if (compact[i] === compact[i + 1]) {
      compact[i] *= 2;
      gained += compact[i];
      compact.splice(i + 1, 1);
    }
  }

  while (compact.length < SIZE) {
    compact.push(0);
  }

  return { values: compact, gained };
}

function moveLeft() {
  let changed = false;
  let gainedTotal = 0;

  const nextBoard = board.map((row, rowIndex) => {
    const { values, gained } = slideValues(row);
    gainedTotal += gained;

    if (!changed) {
      for (let i = 0; i < SIZE; i += 1) {
        if (values[i] !== board[rowIndex][i]) {
          changed = true;
          break;
        }
      }
    }

    return values;
  });

  return { nextBoard, gainedTotal, changed };
}

function moveRight() {
  let changed = false;
  let gainedTotal = 0;

  const nextBoard = board.map((row, rowIndex) => {
    const reversed = [...row].reverse();
    const { values, gained } = slideValues(reversed);
    const normalized = values.reverse();
    gainedTotal += gained;

    if (!changed) {
      for (let i = 0; i < SIZE; i += 1) {
        if (normalized[i] !== board[rowIndex][i]) {
          changed = true;
          break;
        }
      }
    }

    return normalized;
  });

  return { nextBoard, gainedTotal, changed };
}

function moveUp() {
  const nextBoard = createEmptyBoard();
  let changed = false;
  let gainedTotal = 0;

  for (let col = 0; col < SIZE; col += 1) {
    const current = [];
    for (let row = 0; row < SIZE; row += 1) {
      current.push(board[row][col]);
    }

    const { values, gained } = slideValues(current);
    gainedTotal += gained;

    for (let row = 0; row < SIZE; row += 1) {
      nextBoard[row][col] = values[row];
      if (!changed && values[row] !== board[row][col]) {
        changed = true;
      }
    }
  }

  return { nextBoard, gainedTotal, changed };
}

function moveDown() {
  const nextBoard = createEmptyBoard();
  let changed = false;
  let gainedTotal = 0;

  for (let col = 0; col < SIZE; col += 1) {
    const current = [];
    for (let row = SIZE - 1; row >= 0; row -= 1) {
      current.push(board[row][col]);
    }

    const { values, gained } = slideValues(current);
    gainedTotal += gained;

    for (let row = SIZE - 1, index = 0; row >= 0; row -= 1, index += 1) {
      nextBoard[row][col] = values[index];
      if (!changed && values[index] !== board[row][col]) {
        changed = true;
      }
    }
  }

  return { nextBoard, gainedTotal, changed };
}

function canMove() {
  if (getEmptyCells().length > 0) {
    return true;
  }

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const current = board[row][col];
      if (row + 1 < SIZE && board[row + 1][col] === current) {
        return true;
      }
      if (col + 1 < SIZE && board[row][col + 1] === current) {
        return true;
      }
    }
  }

  return false;
}

function has2048() {
  return board.some((row) => row.some((value) => value >= 2048));
}

function tileClass(value) {
  if (value <= 2048) {
    return `tile-${value}`;
  }
  return "tile-super";
}

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = board[row][col];
      const tile = document.createElement("div");
      tile.className = `tile ${tileClass(value)}`;
      tile.textContent = value === 0 ? "" : String(value);
      boardEl.appendChild(tile);
    }
  }
}

function showOverlay(text) {
  overlayTextEl.textContent = text;
  overlayEl.classList.remove("hidden");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
}

function updateStatus(message) {
  statusMessageEl.textContent = message;
}

function applyMove(direction) {
  if (gameOver) {
    return;
  }

  let result;
  if (direction === "left") {
    result = moveLeft();
  } else if (direction === "right") {
    result = moveRight();
  } else if (direction === "up") {
    result = moveUp();
  } else if (direction === "down") {
    result = moveDown();
  } else {
    return;
  }

  if (!result.changed) {
    return;
  }

  board = result.nextBoard;
  updateScore(score + result.gainedTotal);
  spawnTile();
  renderBoard();

  if (!won && has2048()) {
    won = true;
    updateStatus("You reached 2048. Keep going for a higher score.");
  }

  if (!canMove()) {
    gameOver = true;
    updateStatus("No moves left. Start a new game.");
    showOverlay("Game Over");
    reportGameOver(score);
  }
}

function handleKeydown(event) {
  const keyMap = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
    a: "left",
    d: "right",
    w: "up",
    s: "down",
  };

  const direction = keyMap[event.key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  applyMove(direction);
}

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const threshold = 30;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    applyMove(dx > 0 ? "right" : "left");
  } else {
    applyMove(dy > 0 ? "down" : "up");
  }
}

function startNewGame() {
  board = createEmptyBoard();
  won = false;
  gameOver = false;
  gameReported = false;
  updateScore(0);
  bestEl.textContent = String(getBestScore());
  spawnTile();
  spawnTile();
  renderBoard();
  hideOverlay();
  updateStatus("Use arrow keys or swipe to move tiles.");
}

newGameBtn.addEventListener("click", startNewGame);
playAgainBtn.addEventListener("click", startNewGame);
window.addEventListener("keydown", handleKeydown, { passive: false });
boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
boardEl.addEventListener("touchend", handleTouchEnd, { passive: true });

bestEl.textContent = String(getBestScore());
startNewGame();
