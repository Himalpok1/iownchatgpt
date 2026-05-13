const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const holes = [];
const bestKey = "whack_a_mole_best";
let score = 0;
let timeLeft = 30;
let activeIndex = -1;
let gameTimer = null;
let spawnTimer = null;
let running = false;
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function loadBest() {
  const best = Number(localStorage.getItem(bestKey));
  bestEl.textContent = Number.isFinite(best) && best > 0 ? String(best) : "0";
}

function refreshHud() {
  scoreEl.textContent = String(score);
  timeEl.textContent = `${timeLeft}s`;
}

function clearActive() {
  if (activeIndex >= 0) {
    holes[activeIndex].classList.remove("active");
    activeIndex = -1;
  }
}

function setRandomMole() {
  clearActive();
  const next = Math.floor(Math.random() * holes.length);
  activeIndex = next;
  holes[next].classList.add("active");
}

function stopRound() {
  running = false;
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  clearActive();
  startBtn.disabled = false;

  const best = Number(localStorage.getItem(bestKey));
  if (!best || score > best) {
    localStorage.setItem(bestKey, String(score));
    loadBest();
    statusEl.textContent = `Round over. New best score: ${score}.`;
    reportGameOver(score);
    return;
  }

  statusEl.textContent = `Round over. You scored ${score}.`;
  reportGameOver(score);
}

function startRound() {
  if (running) {
    return;
  }

  score = 0;
  timeLeft = 30;
  running = true;
  gameReported = false;
  startBtn.disabled = true;
  statusEl.textContent = "Hit the mole as fast as you can.";
  refreshHud();
  setRandomMole();

  spawnTimer = setInterval(setRandomMole, 700);
  gameTimer = setInterval(() => {
    timeLeft -= 1;
    refreshHud();

    if (timeLeft <= 0) {
      stopRound();
    }
  }, 1000);
}

function onMoleHit(index) {
  if (!running || index !== activeIndex) {
    return;
  }

  score += 1;
  refreshHud();
  setRandomMole();
}

function buildBoard() {
  boardEl.innerHTML = "";

  for (let i = 0; i < 9; i += 1) {
    const hole = document.createElement("div");
    hole.className = "hole";

    const moleBtn = document.createElement("button");
    moleBtn.type = "button";
    moleBtn.className = "mole";
    moleBtn.textContent = "🐹";
    moleBtn.setAttribute("aria-label", "Whack this mole");
    moleBtn.addEventListener("click", () => onMoleHit(i));

    hole.appendChild(moleBtn);
    boardEl.appendChild(hole);
    holes.push(hole);
  }
}

startBtn.addEventListener("click", startRound);
buildBoard();
loadBest();
refreshHud();
