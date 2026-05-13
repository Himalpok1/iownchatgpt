const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const statusMessageEl = document.getElementById("statusMessage");
const restartBtn = document.getElementById("restartBtn");

const symbols = ["🚀", "🎯", "⚡", "🧠", "🎮", "🌟"];
let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timerId = null;
let seconds = 0;
let hasStarted = false;
const bestKey = "memory_match_best_time";
let gameReported = false;

function reportGameOver(finalScore) {
  if (gameReported) {
    return;
  }

  gameReported = true;
  window.parent?.postMessage({ type: "GAME_OVER", score: finalScore }, "*");
}

function shuffledDeck() {
  const cards = [...symbols, ...symbols].map((symbol, index) => ({
    id: index,
    symbol,
  }));

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function formatTime(value) {
  return `${value}s`;
}

function updateStats() {
  movesEl.textContent = String(moves);
  timeEl.textContent = formatTime(seconds);
}

function loadBest() {
  const best = Number(localStorage.getItem(bestKey));
  bestEl.textContent = Number.isFinite(best) && best > 0 ? formatTime(best) : "--";
}

function setStatus(message) {
  statusMessageEl.textContent = message;
}

function startTimerIfNeeded() {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  timerId = window.setInterval(() => {
    seconds += 1;
    updateStats();
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function createCard(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card";
  btn.dataset.symbol = card.symbol;
  btn.setAttribute("aria-label", "Hidden card");

  btn.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-front">?</span>
      <span class="card-face card-back">${card.symbol}</span>
    </span>
  `;

  btn.addEventListener("click", () => onCardClick(btn));
  return btn;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function onCardClick(cardEl) {
  if (lockBoard || cardEl === firstCard || cardEl.classList.contains("matched")) {
    return;
  }

  startTimerIfNeeded();
  cardEl.classList.add("flipped");

  if (!firstCard) {
    firstCard = cardEl;
    return;
  }

  secondCard = cardEl;
  moves += 1;
  updateStats();
  lockBoard = true;

  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches += 1;
    setStatus("Nice match. Keep going.");
    resetTurn();

    if (matches === symbols.length) {
      stopTimer();
      setStatus(`Completed in ${moves} moves and ${seconds}s.`);
      reportGameOver(seconds);
      const currentBest = Number(localStorage.getItem(bestKey));
      if (!currentBest || seconds < currentBest) {
        localStorage.setItem(bestKey, String(seconds));
        loadBest();
        setStatus(`New best time: ${seconds}s in ${moves} moves.`);
      }
    }

    return;
  }

  setStatus("Not a match. Try again.");
  window.setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 700);
}

function initGame() {
  stopTimer();
  deck = shuffledDeck();
  boardEl.innerHTML = "";
  moves = 0;
  matches = 0;
  seconds = 0;
  hasStarted = false;
  gameReported = false;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  updateStats();
  setStatus("Find all matching pairs.");

  deck.forEach((card) => boardEl.appendChild(createCard(card)));
}

restartBtn.addEventListener("click", initGame);
loadBest();
initGame();
