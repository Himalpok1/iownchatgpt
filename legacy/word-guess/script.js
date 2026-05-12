const hintEl = document.getElementById("hint");
const attemptsEl = document.getElementById("attempts");
const wordEl = document.getElementById("word");
const statusEl = document.getElementById("status");
const lettersEl = document.getElementById("letters");
const newBtn = document.getElementById("newBtn");

const words = [
  { word: "algorithm", hint: "Step-by-step problem solving method" },
  { word: "satellite", hint: "Object that orbits a planet" },
  { word: "blockchain", hint: "Distributed ledger technology" },
  { word: "headphones", hint: "Audio device worn on ears" },
  { word: "keyboard", hint: "Input device used for typing" },
  { word: "quantum", hint: "Physics term for discrete packets" },
  { word: "browser", hint: "Software used to access websites" },
];

let target = "";
let guessed = new Set();
let attempts = 6;
let ended = false;

function chooseWord() {
  const item = words[Math.floor(Math.random() * words.length)];
  target = item.word.toUpperCase();
  hintEl.textContent = item.hint;
}

function renderWord() {
  const display = target
    .split("")
    .map((char) => (guessed.has(char) ? char : "_"))
    .join(" ");
  wordEl.textContent = display;
}

function isSolved() {
  return target.split("").every((char) => guessed.has(char));
}

function setStatus(text) {
  statusEl.textContent = text;
}

function onGuess(letter, button) {
  if (ended || guessed.has(letter)) {
    return;
  }

  guessed.add(letter);
  button.disabled = true;

  if (!target.includes(letter)) {
    attempts -= 1;
    attemptsEl.textContent = String(attempts);
  }

  renderWord();

  if (isSolved()) {
    ended = true;
    setStatus(`Solved. The word was ${target}.`);
    lettersEl.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
    return;
  }

  if (attempts <= 0) {
    ended = true;
    setStatus(`Out of attempts. The word was ${target}.`);
    wordEl.textContent = target.split("").join(" ");
    lettersEl.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
    return;
  }

  setStatus("Keep guessing.");
}

function buildKeyboard() {
  lettersEl.innerHTML = "";
  for (let code = 65; code <= 90; code += 1) {
    const letter = String.fromCharCode(code);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "letter-btn";
    btn.textContent = letter;
    btn.addEventListener("click", () => onGuess(letter, btn));
    lettersEl.appendChild(btn);
  }
}

function newGame() {
  guessed = new Set();
  attempts = 6;
  ended = false;
  attemptsEl.textContent = "6";
  chooseWord();
  buildKeyboard();
  renderWord();
  setStatus("Choose letters to solve the word.");
}

newBtn.addEventListener("click", newGame);
newGame();
