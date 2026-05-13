const canvas = document.getElementById("shooterCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const player = { x: canvas.width / 2 - 24, y: canvas.height - 36, w: 48, h: 16, speed: 6 };
let bullets = [];
let enemyBullets = [];
let enemies = [];
let enemyDir = 1;
let score = 0;
let lives = 3;
let level = 1;
let running = false;
let lastShot = 0;
let enemyFireTick = 0;
const keys = { left: false, right: false, shoot: false };
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function createWave() {
  enemies = [];
  const rows = 4;
  const cols = 9;
  const spacingX = 70;
  const spacingY = 44;
  const startX = 70;
  const startY = 60;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      enemies.push({
        x: startX + c * spacingX,
        y: startY + r * spacingY,
        w: 40,
        h: 24,
        alive: true,
      });
    }
  }

  enemyDir = 1;
}

function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameReported = false;
  bullets = [];
  enemyBullets = [];
  player.x = canvas.width / 2 - player.w / 2;
  createWave();
  scoreEl.textContent = "0";
  livesEl.textContent = "3";
  levelEl.textContent = "1";
  statusEl.textContent = "Wave 1. Survive and clear all enemies.";
  running = true;
}

function nextWave() {
  level += 1;
  levelEl.textContent = String(level);
  bullets = [];
  enemyBullets = [];
  createWave();
  statusEl.textContent = `Wave ${level}. Enemies move faster.`;
}

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function update(timestamp) {
  if (!running) {
    return;
  }

  if (keys.left) {
    player.x = Math.max(0, player.x - player.speed);
  }
  if (keys.right) {
    player.x = Math.min(canvas.width - player.w, player.x + player.speed);
  }

  if (keys.shoot && timestamp - lastShot > 220) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 8, w: 4, h: 10, vy: -8 });
    lastShot = timestamp;
  }

  bullets = bullets.filter((bullet) => bullet.y > -20);
  bullets.forEach((bullet) => {
    bullet.y += bullet.vy;
  });

  let edgeReached = false;
  const speed = 0.8 + (level - 1) * 0.2;
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }
    enemy.x += speed * enemyDir;
    if (enemy.x < 8 || enemy.x + enemy.w > canvas.width - 8) {
      edgeReached = true;
    }
  });

  if (edgeReached) {
    enemyDir *= -1;
    enemies.forEach((enemy) => {
      if (enemy.alive) {
        enemy.y += 16;
      }
    });
  }

  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (!enemy.alive) {
        return;
      }

      if (rectHit(bullet, enemy)) {
        enemy.alive = false;
        bullet.y = -50;
        score += 10;
        scoreEl.textContent = String(score);
      }
    });
  });

  enemyFireTick += 1;
  if (enemyFireTick > Math.max(35, 70 - level * 5)) {
    enemyFireTick = 0;
    const shooters = enemies.filter((enemy) => enemy.alive);
    if (shooters.length) {
      const shooter = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({ x: shooter.x + shooter.w / 2 - 2, y: shooter.y + shooter.h, w: 4, h: 10, vy: 4 + level * 0.2 });
    }
  }

  enemyBullets = enemyBullets.filter((bullet) => bullet.y < canvas.height + 20);
  enemyBullets.forEach((bullet) => {
    bullet.y += bullet.vy;

    if (rectHit(bullet, player)) {
      bullet.y = canvas.height + 30;
      lives -= 1;
      livesEl.textContent = String(lives);
      if (lives <= 0) {
        running = false;
        statusEl.textContent = `Game over. Final score: ${score}.`;
        reportGameOver(score);
      }
    }
  });

  const reachedBottom = enemies.some((enemy) => enemy.alive && enemy.y + enemy.h >= player.y);
  if (reachedBottom) {
    running = false;
    statusEl.textContent = `Enemies reached your base. Final score: ${score}.`;
    reportGameOver(score);
  }

  if (enemies.every((enemy) => !enemy.alive)) {
    nextWave();
  }
}

function drawStars() {
  ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
  for (let i = 0; i < 70; i += 1) {
    const x = (i * 97) % canvas.width;
    const y = (i * 57) % canvas.height;
    ctx.fillRect(x, y, 1, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#050a1b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawStars();

  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#f8fafc";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  ctx.fillStyle = "#f87171";
  enemyBullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }
    ctx.fillStyle = "#f97316";
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  });
}

function loop(timestamp) {
  update(timestamp || 0);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    keys.left = true;
    event.preventDefault();
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    keys.right = true;
    event.preventDefault();
  }
  if (event.key === " ") {
    keys.shoot = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    keys.left = false;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    keys.right = false;
  }
  if (event.key === " ") {
    keys.shoot = false;
  }
});

startBtn.addEventListener("click", resetGame);
draw();
loop();
