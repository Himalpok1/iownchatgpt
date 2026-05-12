const choiceButtons = document.querySelectorAll(".choice");
const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const roundCountEl = document.getElementById("roundCount");
const resultTextEl = document.getElementById("resultText");
const detailTextEl = document.getElementById("detailText");
const historyListEl = document.getElementById("historyList");
const resetBtn = document.getElementById("resetBtn");

const options = ["rock", "paper", "scissors"];
let playerScore = 0;
let cpuScore = 0;
let round = 1;

function cpuChoice() {
  return options[Math.floor(Math.random() * options.length)];
}

function pretty(choice) {
  return choice.charAt(0).toUpperCase() + choice.slice(1);
}

function winner(player, cpu) {
  if (player === cpu) {
    return "draw";
  }

  if (
    (player === "rock" && cpu === "scissors") ||
    (player === "paper" && cpu === "rock") ||
    (player === "scissors" && cpu === "paper")
  ) {
    return "player";
  }

  return "cpu";
}

function addHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  historyListEl.prepend(li);

  while (historyListEl.children.length > 7) {
    historyListEl.removeChild(historyListEl.lastChild);
  }
}

function refreshScore() {
  playerScoreEl.textContent = String(playerScore);
  cpuScoreEl.textContent = String(cpuScore);
  roundCountEl.textContent = String(round);
}

function checkMatchEnd() {
  if (playerScore < 5 && cpuScore < 5) {
    return false;
  }

  if (playerScore === 5) {
    resultTextEl.textContent = "You won the match.";
    detailTextEl.textContent = "Reset to play again.";
  } else {
    resultTextEl.textContent = "Computer won the match.";
    detailTextEl.textContent = "Reset to try again.";
  }

  choiceButtons.forEach((button) => {
    button.disabled = true;
  });

  return true;
}

function playRound(playerMove) {
  const cpuMove = cpuChoice();
  const roundWinner = winner(playerMove, cpuMove);

  if (roundWinner === "player") {
    playerScore += 1;
    resultTextEl.textContent = "You win this round.";
  } else if (roundWinner === "cpu") {
    cpuScore += 1;
    resultTextEl.textContent = "Computer wins this round.";
  } else {
    resultTextEl.textContent = "Round is a draw.";
  }

  detailTextEl.textContent = `You: ${pretty(playerMove)} | Computer: ${pretty(cpuMove)}`;
  addHistory(`Round ${round}: ${pretty(playerMove)} vs ${pretty(cpuMove)} (${roundWinner})`);

  refreshScore();
  if (!checkMatchEnd()) {
    round += 1;
    roundCountEl.textContent = String(round);
  }
}

function resetMatch() {
  playerScore = 0;
  cpuScore = 0;
  round = 1;
  resultTextEl.textContent = "Pick your move to start.";
  detailTextEl.textContent = "";
  historyListEl.innerHTML = "";

  choiceButtons.forEach((button) => {
    button.disabled = false;
  });

  refreshScore();
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.choice);
  });
});

resetBtn.addEventListener("click", resetMatch);
refreshScore();
