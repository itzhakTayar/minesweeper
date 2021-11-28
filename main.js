'use strict';
// globals

var gBoard;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gIntervalID;
var gIntervalID;
var gTimer = false;
const MINE = '💣';
const FLAG = '🚩';
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gVictory = false;
var gLives;
var gCountMineNegs;
var gSave;
initGame();
function initGame() {
  gLives = 3;
  gBoard = createBoard();
  renderBoard(gBoard);
  gGame.isOn = true;
  setMins(gLevel.MINES);
  resetTimer();
  gTimer = false;
  gLives = 3;
  gSave = 3;
  lives();
  resetSaveBtn();
  resetBtnTxt('restart😀');
}

function createBoard() {
  var size = gLevel.SIZE;
  var board = createMat(size, size);
  //  lopping the board for fill up the board cell by specific conditions
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // create cell(object)
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }; // update the content in each cell (model)

      board[i][j] = cell;
    }
  }
  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var className = getClassName({ i: i, j: j });
      //   defined the cell content and witch function they active
      strHTML += `\t<td data-i="${i}" data-j="${j}" 
        onclick="cellClicked(${i}, ${j})" class="cell ${className}" oncontextmenu="rightClickEvent(${i}, ${j})"`;

      //   designs each cell base on MODEL(you may add condition for special designs)
      strHTML += '';
      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }
  //   catch the table body from the dom
  var elBoard = document.querySelector('tbody');

  //   update the board on the dom
  elBoard.innerHTML = strHTML;
}

function setMinesNegsCount(pos) {
  gCountMineNegs = '';
  var emptyCells = [];
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue; //check if dont get outside of the board [i]
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue; //check if dont get outside of the board [j]
      if (i === pos.i && j === pos.j) continue; //check if curCell
      var curCell = gBoard[i][j];

      var position = { i: i, j: j };
      var cellClicked = pos;

      // console.log(position);
      if (curCell.isMine) {
        gCountMineNegs++;
      }
      if (!curCell.isMine) {
        emptyCells.push(position);
      }
    }
  }
  if (
    !gCountMineNegs &&
    gBoard[cellClicked.i][cellClicked.j].isMine === false
  ) {
    var count = '';
    for (var i = 0; i < emptyCells.length; i++) {
      count = checkNegsCellMines(emptyCells[i]);
      renderCell(emptyCells[i], count);
    }
  }
  return gCountMineNegs;
}
function cellClicked(i, j) {
  var curCell = gBoard[i][j];
  var pos = { i: i, j: j };
  var mineNegs = setMinesNegsCount(pos);

  if (!gTimer) timer();
  if (!gGame.isOn) return;
  if (curCell.isShown) return;
  if (curCell.isMarked) {
    renderCell(pos, '🚩');
    return;
  }
  curCell.isShown = true;
  isCellClick();
  if (curCell.isMine) {
    gLives--;
    lives();
    renderCell(pos, MINE);
    if (!gLives) {
      gVictory = false;
      showAllMines();
      endGame();
    }
  } else {
    renderCell(pos, mineNegs);
  }

  checkVictory();
}

function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
  gBoard[location.i][location.j].isShown = true;
  elCell.classList.add('clicked');
  if (elCell.innerText === 1) {
    elCell.style.color = 'red';
  }
}

function endGame() {
  clearInterval(gIntervalID);
  gGame.isOn = false;
  if (gVictory) {
    showModal('green', 'you won!!');
    resetBtnTxt('restart🤩');
  } else {
    showModal('red', 'you lose!!');
    resetBtnTxt('restart🤯');
  }
}

function resetBtnTxt(value) {
  var elResetBtn = document.querySelector('.restartBtn');
  elResetBtn.innerText = value;
}
function reset() {
  removeModal();

  gGame.shownCount = 0;
  clearInterval(gIntervalID);
  resetTimer();
  gTimer = false;
  initGame();
}
function showModal(color, txt) {
  var elModal = document.querySelector('.modal');
  elModal.classList.remove('hidden');
  elModal.style.color = color;
  elModal.innerText = txt;
}

function removeModal() {
  var elModal = document.querySelector('.modal');
  elModal.classList.add('hidden');
}

function getRandomCell() {
  var randomCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.isMine) continue;
      randomCells.push({ i: i, j: j });
    }
  }
  var randIdx = getRandomInt(0, randomCells.length);
  return randomCells[randIdx];
}

function setRandomLocationMine() {
  var cell = getRandomCell();

  console.log(cell);
  var i = cell.i;
  var j = cell.j;
  var randomCell = gBoard[i][j];
  randomCell.isMine = true;
}

function setMins(num) {
  for (var i = 0; i < num; i++) {
    setRandomLocationMine();
  }
}

function timer() {
  gTimer = true;
  var timer = document.querySelector('.timer');
  var countDown = 0;
  var distance = 0.01;
  gIntervalID = setInterval(function () {
    countDown += distance;
    timer.innerHTML = countDown.toFixed(2);
  }, 10);
}

function resetTimer() {
  var timer = document.querySelector('.timer');
  var txt = 0;
  timer.innerText = txt.toFixed(3);
}

function rightClickEvent(i, j) {
  if (!gTimer) {
    timer();
  }
  var position = { i: i, j: j };
  var countMines = checkNegsCellMines(position);
  var pos = gBoard[i][j];
  if (gGame.isOn === true) {
    if (pos.isMarked === false) {
      pos.isMarked = true;
      pos.isShown = true;
      console.log('isShown', pos.isShown);
      console.log('isMarked', pos.isMarked);
      // model
      renderCell(position, '🚩');
    } else {
      pos.isMarked = false;
      pos.isShown = false;
      console.log('isShown', pos.isShown);
      console.log('isMarked', pos.isMarked);
      renderCell(position, countMines);
    }
  }
  checkVictory();
}

checkVictory();
function checkVictory() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var curCell = gBoard[i][j];
      if (!curCell.isShown) return;
    }
  }
  gVictory = true;

  endGame();
}

function checkNegsCellMines(pos) {
  var mineCounter = 0;
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue; //check if dont get outside of the board [i]
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue; //check if dont get outside of the board [j]
      if (i === pos.i && j === pos.j) continue; //check if curCell
      var curCell = gBoard[i][j];

      if (curCell.isMine) mineCounter++;
    }
  }
  return mineCounter;
}

function showAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var curCell = gBoard[i][j];
      var pos = { i: i, j: j };
      if (curCell.isMine) renderCell(pos, MINE);
    }
  }
}

function easy() {
  clearInterval(gIntervalID);
  resetBtnTxt('😀');
  removeModal();
  gLevel.SIZE = 4;
  gLevel.MINES = 2;
  initGame();
}

function medium() {
  clearInterval(gIntervalID);
  resetBtnTxt('😀');
  removeModal();
  gLevel.SIZE = 8;
  gLevel.MINES = 12;
  initGame();
}

function hard() {
  clearInterval(gIntervalID);
  resetBtnTxt('😀');
  removeModal();
  gLevel.SIZE = 12;
  gLevel.MINES = 30;
  initGame();
}

function lives() {
  var elLives = document.querySelector('p');
  if (gLives === 3) {
    elLives.innerText = '❤❤❤';
  } else if (gLives === 2) {
    elLives.innerText = '❤❤';
  } else if (gLives === 1) {
    elLives.innerText = '❤';
  } else {
    elLives.innerText = '';
  }
}

function save(elBtn) {
  if (!gSave) return;
  gSave--;
  elBtn.innerText = `save(${gSave})`;
  var randomCell = getRandomCell();
  var elRandomCell = document.querySelector(
    `.cell-${randomCell.i}-${randomCell.j}`
  );
  console.log(elRandomCell);
  elRandomCell.style.background = 'linear-gradient(to top, yellow, red)';
  setTimeout(() => {
    elRandomCell.style.background = 'linear-gradient(to top, black, yellow)';
  }, 1500);
}
function changeColorOfClickedCell(pos) {
  var clickedCell = document.querySelector(`.cell-${pos.i}-${pos.j}`);
  clickedCell.style.background = 'linear-gradient(to top, black, white)';
}
function isCellClick() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var pos = { i: i, j: j };
      var curCell = gBoard[i][j];
      if (curCell.isShown) {
        changeColorOfClickedCell(pos);
      }
    }
  }
}

function resetSaveBtn() {
  var elBtn = document.querySelector('.saveBtn');
  elBtn.innerText = `save(${gSave})`;
}

function getMinesNumFromUser() {
  var elInput = document.querySelector('input').value;
  var value = elInput - gLevel.MINES;
  setMins(value);
}
