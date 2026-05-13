const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const paddle = { width: 120, height: 12, x: 320, y: canvas.height - 28, speed: 7 };
const ball = { x: canvas.width / 2, y: canvas.height - 44, r: 8, vx: 4, vy: -4 };
const rows = 5;
const cols = 9;
const brickWidth = 72;
const brickHeight = 22;
const brickPad = 8;
const offsetTop = 56;
const offsetLeft = 24;

let bricks = [];
let score = 0;
let lives = 3;
let running = false;
let leftPressed = false;
let rightPressed = false;
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function createBricks() {
  bricks = [];
  for (let row = 0; row < rows; row += 1) {
    const line = [];
    for (let col = 0; col < cols; col += 1) {
      line.push({ hit: false });
    }
    bricks.push(line);
  }
}

function resetBallAndPaddle() {
  paddle.x = canvas.width / 2 - paddle.width / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 44;
  ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = -4;
}

function resetGame() {
  score = 0;
  lives = 3;
  gameReported = false;
  scoreEl.textContent = "0";
  livesEl.textContent = "3";
  createBricks();
  resetBallAndPaddle();
  running = true;
  statusEl.textContent = "Break all bricks.";
}

function drawBricks() {
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (bricks[row][col].hit) {
        continue;
      }

      const x = offsetLeft + col * (brickWidth + brickPad);
      const y = offsetTop + row * (brickHeight + brickPad);
      const hue = 22 + row * 22;
      ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
      ctx.fillRect(x, y, brickWidth, brickHeight);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.strokeRect(x, y, brickWidth, brickHeight);
    }
  }
}

function collisionWithBricks() {
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const brick = bricks[row][col];
      if (brick.hit) {
        continue;
      }

      const x = offsetLeft + col * (brickWidth + brickPad);
      const y = offsetTop + row * (brickHeight + brickPad);

      if (
        ball.x > x &&
        ball.x < x + brickWidth &&
        ball.y - ball.r < y + brickHeight &&
        ball.y + ball.r > y
      ) {
        brick.hit = true;
        ball.vy *= -1;
        score += 10;
        scoreEl.textContent = String(score);
        return;
      }
    }
  }
}

function remainingBricks() {
  let remaining = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!bricks[row][col].hit) {
        remaining += 1;
      }
    }
  }
  return remaining;
}

function update() {
  if (leftPressed) {
    paddle.x = Math.max(0, paddle.x - paddle.speed);
  }
  if (rightPressed) {
    paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) {
    ball.vx *= -1;
  }
  if (ball.y - ball.r <= 0) {
    ball.vy *= -1;
  }

  if (
    ball.y + ball.r >= paddle.y &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.vy > 0
  ) {
    const hit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.vx += hit * 1.5;
    ball.vy *= -1;
  }

  collisionWithBricks();

  if (ball.y - ball.r > canvas.height) {
    lives -= 1;
    livesEl.textContent = String(lives);
    if (lives <= 0) {
      running = false;
      statusEl.textContent = `Game over. Final score: ${score}.`;
      reportGameOver(score);
      return;
    }
    resetBallAndPaddle();
  }

  if (remainingBricks() === 0) {
    running = false;
    statusEl.textContent = `You cleared the board. Score: ${score}.`;
    reportGameOver(score);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#090d20";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBricks();

  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
}

function loop() {
  if (running) {
    update();
  }
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    leftPressed = true;
    event.preventDefault();
  }
  if (event.key === "ArrowRight") {
    rightPressed = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    leftPressed = false;
  }
  if (event.key === "ArrowRight") {
    rightPressed = false;
  }
});

startBtn.addEventListener("click", resetGame);
createBricks();
draw();
loop();
