const SIZE = 10;
const MINES = 15;

const boardEl = document.getElementById("board");
const minesLeftEl = document.getElementById("minesLeft");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = [];
let firstClick = true;
let revealedCount = 0;
let flagsCount = 0;
let timer = null;
let seconds = 0;
let ended = false;

function createBoardData() {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adj: 0,
    }))
  );
}

function inBounds(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function neighbors(row, col) {
  const list = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) {
        continue;
      }
      const nr = row + dr;
      const nc = col + dc;
      if (inBounds(nr, nc)) {
        list.push([nr, nc]);
      }
    }
  }
  return list;
}

function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < MINES) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    const cell = board[row][col];
    if ((row === excludeRow && col === excludeCol) || cell.mine) {
      continue;
    }
    cell.mine = true;
    placed += 1;
  }

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col].mine) {
        continue;
      }
      const count = neighbors(row, col).filter(([r, c]) => board[r][c].mine).length;
      board[row][col].adj = count;
    }
  }
}

function createBoardUI() {
  boardEl.innerHTML = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.dataset.row = String(row);
      btn.dataset.col = String(col);
      btn.addEventListener("click", () => reveal(row, col));
      btn.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        toggleFlag(row, col);
      });
      boardEl.appendChild(btn);
    }
  }
}

function cellButton(row, col) {
  return boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function refreshMinesLeft() {
  minesLeftEl.textContent = String(Math.max(0, MINES - flagsCount));
}

function startTimer() {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    seconds += 1;
    timeEl.textContent = `${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function revealAllMines() {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = board[row][col];
      if (!cell.mine) {
        continue;
      }
      const btn = cellButton(row, col);
      btn.classList.add("revealed", "mine");
      btn.textContent = "💣";
    }
  }
}

function reveal(row, col) {
  if (ended) {
    return;
  }

  const cell = board[row][col];
  if (cell.revealed || cell.flagged) {
    return;
  }

  if (firstClick) {
    firstClick = false;
    placeMines(row, col);
    startTimer();
  }

  if (cell.mine) {
    ended = true;
    revealAllMines();
    stopTimer();
    statusEl.textContent = "Boom. You hit a mine.";
    return;
  }

  const stack = [[row, col]];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const current = board[cr][cc];
    if (current.revealed || current.flagged) {
      continue;
    }

    current.revealed = true;
    revealedCount += 1;

    const btn = cellButton(cr, cc);
    btn.classList.add("revealed");
    if (current.adj > 0) {
      btn.textContent = String(current.adj);
    }

    if (current.adj === 0) {
      neighbors(cr, cc).forEach(([nr, nc]) => {
        const next = board[nr][nc];
        if (!next.revealed && !next.mine) {
          stack.push([nr, nc]);
        }
      });
    }
  }

  if (revealedCount === SIZE * SIZE - MINES) {
    ended = true;
    stopTimer();
    statusEl.textContent = `You cleared the board in ${seconds}s.`;
  }
}

function toggleFlag(row, col) {
  if (ended) {
    return;
  }

  const cell = board[row][col];
  if (cell.revealed) {
    return;
  }

  const btn = cellButton(row, col);
  cell.flagged = !cell.flagged;

  if (cell.flagged) {
    flagsCount += 1;
    btn.classList.add("flagged");
    btn.textContent = "🚩";
  } else {
    flagsCount -= 1;
    btn.classList.remove("flagged");
    btn.textContent = "";
  }

  refreshMinesLeft();
}

function resetGame() {
  board = createBoardData();
  firstClick = true;
  revealedCount = 0;
  flagsCount = 0;
  seconds = 0;
  ended = false;
  stopTimer();
  timeEl.textContent = "0s";
  statusEl.textContent = "Left-click to reveal. Right-click to flag.";
  refreshMinesLeft();
  createBoardUI();
}

resetBtn.addEventListener("click", resetGame);
resetGame();
