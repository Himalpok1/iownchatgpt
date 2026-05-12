const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");

const paddle = { width: 12, height: 86, speed: 6 };
const leftPaddle = { x: 24, y: canvas.height / 2 - paddle.height / 2 };
const rightPaddle = { x: canvas.width - 36, y: canvas.height / 2 - paddle.height / 2 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, r: 8, vx: 4, vy: 3 };
const keys = { up: false, down: false };

let playerScore = 0;
let cpuScore = 0;
let running = false;

function resetBall(direction = 1) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 4 * direction;
  ball.vy = (Math.random() * 4 - 2) || 2;
}

function resetMatch() {
  playerScore = 0;
  cpuScore = 0;
  playerScoreEl.textContent = "0";
  cpuScoreEl.textContent = "0";
  leftPaddle.y = canvas.height / 2 - paddle.height / 2;
  rightPaddle.y = canvas.height / 2 - paddle.height / 2;
  resetBall(Math.random() > 0.5 ? 1 : -1);
  statusEl.textContent = "Match started. Use up/down keys.";
}

function clampPaddle(y) {
  return Math.max(0, Math.min(canvas.height - paddle.height, y));
}

function update() {
  if (keys.up) {
    leftPaddle.y = clampPaddle(leftPaddle.y - paddle.speed);
  }
  if (keys.down) {
    leftPaddle.y = clampPaddle(leftPaddle.y + paddle.speed);
  }

  const target = ball.y - paddle.height / 2;
  const cpuStep = 4.2;
  if (rightPaddle.y < target) {
    rightPaddle.y = clampPaddle(rightPaddle.y + cpuStep);
  } else {
    rightPaddle.y = clampPaddle(rightPaddle.y - cpuStep);
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
  }

  const hitsLeft =
    ball.x - ball.r <= leftPaddle.x + paddle.width &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + paddle.height &&
    ball.vx < 0;

  const hitsRight =
    ball.x + ball.r >= rightPaddle.x &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + paddle.height &&
    ball.vx > 0;

  if (hitsLeft || hitsRight) {
    const padY = hitsLeft ? leftPaddle.y : rightPaddle.y;
    const relative = (ball.y - (padY + paddle.height / 2)) / (paddle.height / 2);
    ball.vx *= -1.04;
    ball.vy += relative * 1.8;
  }

  if (ball.x < 0) {
    cpuScore += 1;
    cpuScoreEl.textContent = String(cpuScore);
    resetBall(1);
  }

  if (ball.x > canvas.width) {
    playerScore += 1;
    playerScoreEl.textContent = String(playerScore);
    resetBall(-1);
  }

  if (playerScore >= 7 || cpuScore >= 7) {
    running = false;
    statusEl.textContent = playerScore > cpuScore ? "You won the match." : "CPU won the match.";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#08111f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#2a3d63";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#f97316";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0ea5e9";
  ctx.fillRect(rightPaddle.x, rightPaddle.y, paddle.width, paddle.height);

  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
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
  if (event.key === "ArrowUp") {
    keys.up = true;
    event.preventDefault();
  }
  if (event.key === "ArrowDown") {
    keys.down = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    keys.up = false;
  }
  if (event.key === "ArrowDown") {
    keys.down = false;
  }
});

startBtn.addEventListener("click", () => {
  resetMatch();
  running = true;
});

draw();
loop();
