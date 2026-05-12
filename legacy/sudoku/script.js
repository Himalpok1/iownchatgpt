const gridEl = document.getElementById("grid");
const newBtn = document.getElementById("newBtn");
const checkBtn = document.getElementById("checkBtn");
const solveBtn = document.getElementById("solveBtn");
const statusEl = document.getElementById("status");

const puzzles = [
  {
    puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  },
  {
    puzzle: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
    solution: "435269781682571493197834562826195347374682915951743628519326874248957136763418259",
  },
  {
    puzzle: "300000000005009000200504000020000700160000058704310600000890100000067080000005437",
    solution: "381672945475139286296584713823456791169723458754318629537894162942167583618245437",
  },
];

let active = null;

function randomPuzzle() {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

function createCell(index, value) {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 1;
  input.className = "cell";

  const col = index % 9;
  const row = Math.floor(index / 9);
  if ((col + 1) % 3 === 0 && col !== 8) {
    input.classList.add("group-right");
  }
  if ((row + 1) % 3 === 0 && row !== 8) {
    input.classList.add("group-bottom");
  }

  if (value !== "0") {
    input.value = value;
    input.disabled = true;
    input.classList.add("fixed");
  }

  input.dataset.index = String(index);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^1-9]/g, "");
    input.classList.remove("bad");
  });

  return input;
}

function renderPuzzle() {
  gridEl.innerHTML = "";
  active.puzzle.split("").forEach((char, index) => {
    gridEl.appendChild(createCell(index, char));
  });
}

function boardValue() {
  const values = [];
  gridEl.querySelectorAll(".cell").forEach((cell) => {
    values.push(cell.value || "0");
  });
  return values.join("");
}

function checkBoard() {
  const cells = Array.from(gridEl.querySelectorAll(".cell"));
  const current = boardValue();

  let wrong = 0;
  cells.forEach((cell, idx) => {
    cell.classList.remove("bad");
    if (cell.disabled || !cell.value) {
      return;
    }
    if (cell.value !== active.solution[idx]) {
      cell.classList.add("bad");
      wrong += 1;
    }
  });

  if (wrong === 0 && current === active.solution) {
    statusEl.textContent = "Solved correctly.";
    return;
  }

  if (wrong === 0) {
    statusEl.textContent = "So far so good. Keep filling the grid.";
  } else {
    statusEl.textContent = `${wrong} cells are incorrect.`;
  }
}

function solveBoard() {
  gridEl.querySelectorAll(".cell").forEach((cell, idx) => {
    cell.value = active.solution[idx];
    cell.classList.remove("bad");
  });
  statusEl.textContent = "Puzzle solved.";
}

function newPuzzle() {
  active = randomPuzzle();
  renderPuzzle();
  statusEl.textContent = "Fill empty cells with numbers 1-9.";
}

newBtn.addEventListener("click", newPuzzle);
checkBtn.addEventListener("click", checkBoard);
solveBtn.addEventListener("click", solveBoard);
newPuzzle();
