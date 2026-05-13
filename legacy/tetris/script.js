const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const COLS = 10;
const ROWS = 20;
const BLOCK = canvas.width / COLS;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
];

const COLORS = ["#38bdf8", "#fbbf24", "#a855f7", "#f97316", "#3b82f6", "#22c55e", "#ef4444"];

let board = [];
let piece = null;
let score = 0;
let lines = 0;
let level = 1;
let running = false;
let timer = null;
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[idx].map((row) => [...row]);
  return {
    shape,
    color: COLORS[idx],
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 1, BLOCK - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b1023";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const cell = board[y][x];
      if (cell) {
        drawCell(x, y, cell);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 1, BLOCK - 1);
      }
    }
  }

  if (!piece) {
    return;
  }

  piece.shape.forEach((row, py) => {
    row.forEach((value, px) => {
      if (!value) {
        return;
      }
      drawCell(piece.x + px, piece.y + py, piece.color);
    });
  });
}

function collides(testPiece, dx = 0, dy = 0, testShape = null) {
  const shape = testShape || testPiece.shape;
  for (let y = 0; y < shape.length; y += 1) {
    for (let x = 0; x < shape[y].length; x += 1) {
      if (!shape[y][x]) {
        continue;
      }
      const nx = testPiece.x + x + dx;
      const ny = testPiece.y + y + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) {
        return true;
      }
      if (ny >= 0 && board[ny][nx]) {
        return true;
      }
    }
  }
  return false;
}

function rotate(shape) {
  return shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
}

function mergePiece() {
  piece.shape.forEach((row, py) => {
    row.forEach((value, px) => {
      if (!value) {
        return;
      }
      const by = piece.y + py;
      const bx = piece.x + px;
      if (by >= 0) {
        board[by][bx] = piece.color;
      }
    });
  });
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      cleared += 1;
      y += 1;
    }
  }

  if (cleared > 0) {
    lines += cleared;
    score += cleared * 100 * level;
    level = 1 + Math.floor(lines / 10);
    scoreEl.textContent = String(score);
    levelEl.textContent = String(level);
    updateSpeed();
  }
}

function updateSpeed() {
  if (!running) {
    return;
  }
  clearInterval(timer);
  const delay = Math.max(120, 700 - (level - 1) * 60);
  timer = setInterval(tick, delay);
}

function gameOver() {
  running = false;
  clearInterval(timer);
  timer = null;
  statusEl.textContent = `Game over. Score: ${score}. Start again.`;
  reportGameOver(score);
}

function spawnPiece() {
  piece = randomPiece();
  if (collides(piece)) {
    gameOver();
  }
}

function tick() {
  if (!running) {
    return;
  }

  if (!collides(piece, 0, 1)) {
    piece.y += 1;
  } else {
    mergePiece();
    clearLines();
    spawnPiece();
  }

  draw();
}

function startGame() {
  board = createBoard();
  score = 0;
  lines = 0;
  level = 1;
  running = true;
  gameReported = false;
  scoreEl.textContent = "0";
  levelEl.textContent = "1";
  statusEl.textContent = "Controls: left/right, rotate with up, down to drop.";
  spawnPiece();
  updateSpeed();
  draw();
}

window.addEventListener("keydown", (event) => {
  if (!running || !piece) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (!collides(piece, -1, 0)) {
      piece.x -= 1;
    }
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    if (!collides(piece, 1, 0)) {
      piece.x += 1;
    }
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!collides(piece, 0, 1)) {
      piece.y += 1;
      score += 1;
      scoreEl.textContent = String(score);
    }
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    const rotated = rotate(piece.shape);
    if (!collides(piece, 0, 0, rotated)) {
      piece.shape = rotated;
    }
  }

  draw();
});

startBtn.addEventListener("click", startGame);
board = createBoard();
draw();
