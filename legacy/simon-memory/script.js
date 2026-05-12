const padsEl = document.getElementById("pads");
const levelEl = document.getElementById("level");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const BEST_KEY = "simon_memory_best";
let sequence = [];
let playerIndex = 0;
let acceptingInput = false;
let level = 0;

function loadBest() {
  const best = Number(localStorage.getItem(BEST_KEY));
  bestEl.textContent = Number.isFinite(best) && best > 0 ? String(best) : "0";
}

function updateBest() {
  const best = Number(localStorage.getItem(BEST_KEY)) || 0;
  if (level > best) {
    localStorage.setItem(BEST_KEY, String(level));
    bestEl.textContent = String(level);
  }
}

function flashPad(index, duration = 260) {
  const pad = padsEl.querySelector(`.pad[data-pad="${index}"]`);
  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), duration);
}

function playSequence() {
  acceptingInput = false;
  statusEl.textContent = "Watch the pattern.";
  sequence.forEach((value, idx) => {
    setTimeout(() => {
      flashPad(value);
    }, idx * 520 + 240);
  });

  const totalDelay = sequence.length * 520 + 320;
  setTimeout(() => {
    playerIndex = 0;
    acceptingInput = true;
    statusEl.textContent = "Your turn.";
  }, totalDelay);
}

function nextRound() {
  level += 1;
  levelEl.textContent = String(level);
  sequence.push(Math.floor(Math.random() * 4));
  playSequence();
}

function gameOver() {
  acceptingInput = false;
  updateBest();
  statusEl.textContent = `Wrong pad. Game over at level ${level}.`;
}

function onPadClick(index) {
  if (!acceptingInput) {
    return;
  }

  flashPad(index, 160);

  if (sequence[playerIndex] !== index) {
    gameOver();
    return;
  }

  playerIndex += 1;
  if (playerIndex === sequence.length) {
    acceptingInput = false;
    statusEl.textContent = "Correct. Next round...";
    setTimeout(nextRound, 700);
  }
}

function startGame() {
  sequence = [];
  playerIndex = 0;
  level = 0;
  levelEl.textContent = "0";
  statusEl.textContent = "Get ready.";
  setTimeout(nextRound, 350);
}

padsEl.querySelectorAll(".pad").forEach((pad) => {
  pad.addEventListener("click", () => {
    onPadClick(Number(pad.dataset.pad));
  });
});

startBtn.addEventListener("click", startGame);
loadBest();
