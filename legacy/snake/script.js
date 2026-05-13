const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const GRID = 20;
const CELL = canvas.width / GRID;
const BEST_KEY = "snake_best_score";

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let speed = 140;
let timerId = null;
let running = false;

function loadBest() {
  const best = Number(localStorage.getItem(BEST_KEY));
  bestEl.textContent = Number.isFinite(best) && best > 0 ? String(best) : "0";
}

function updateBest() {
  const best = Number(localStorage.getItem(BEST_KEY)) || 0;
  if (score > best) {
    localStorage.setItem(BEST_KEY, String(score));
    bestEl.textContent = String(score);
  }
}

function randomFood() {
  const occupied = new Set(snake.map((part) => `${part.x},${part.y}`));
  let x;
  let y;
  do {
    x = Math.floor(Math.random() * GRID);
    y = Math.floor(Math.random() * GRID);
  } while (occupied.has(`${x},${y}`));

  food = { x, y };
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = 140;
  scoreEl.textContent = "0";
  randomFood();
  draw();
}

function gameOver() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  updateBest();
  window.parent?.postMessage({ type: "GAME_OVER", score }, "*");
  statusEl.textContent = `Game over. Score: ${score}. Press Start / Restart.`;
}

function step() {
  direction = nextDirection;
  const head = snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

  if (
    nextHead.x < 0 ||
    nextHead.x >= GRID ||
    nextHead.y < 0 ||
    nextHead.y >= GRID ||
    snake.some((part) => part.x === nextHead.x && part.y === nextHead.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    randomFood();

    if (score % 5 === 0 && speed > 70) {
      speed -= 10;
      clearInterval(timerId);
      timerId = setInterval(step, speed);
    }
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#152a46" : "#13233d";
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }

  ctx.fillStyle = "#fb7185";
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.7, 0, Math.PI * 2);
  ctx.fill();

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

function startGame() {
  resetGame();
  running = true;
  statusEl.textContent = "Game running. Use arrow keys or WASD.";
  clearInterval(timerId);
  timerId = setInterval(step, speed);
}

window.addEventListener("keydown", (event) => {
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const move = map[event.key];
  if (!move) {
    return;
  }

  event.preventDefault();

  if (
    move.x === -direction.x &&
    move.y === -direction.y &&
    snake.length > 1
  ) {
    return;
  }

  nextDirection = move;
});

startBtn.addEventListener("click", startGame);
loadBest();
resetGame();
