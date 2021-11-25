// create mat

function createMat(row, cow) {
  var mat = [];
  for (var i = 0; i < row; i++) {
    mat[i] = [];
    for (var j = 0; j < cow; j++) {
      mat[i][j] = {};
    }
  }
  return mat;
}

// init();
// main function that activated in the begin and in the reset
// model=createBoard()
// dom=renderBoard

function createBoard() {
  var board = createMat(5, 5);
  //  lopping the board for fill up the board cell by specific conditions
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // create cell(object)
      var cell = {}; // update the content in each cell (model)
      //   defined cells in the board
      board[i][j] = cell;
    }
  }
  return board;
}

// update the board on the dom
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var className = getClassName({ i: i, j: j });
      //   defined the cell content and witch function they active
      strHTML += `\t<td data-i="${i}" data-j="${j}" 
      onclick="cellClicked(this, ${i}, ${j})" class="cell ${className}" >`;

      //   designs each cell base on MODEL(you may add condition for special designs)
      strHTML += currCell.x + currCell.y;
      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }
  //   catch the table body from the dom
  var elBoard = document.querySelector('.board');
  console.log(elBoard);
  //   update the board on the dom
  elBoard.innerHTML = strHTML;
}

// update specific cell in dom
function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Returns class name for a specific cell by his location({i:i,j:j})
function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

// cell clicked
function cellClicked(elbtn, i, j) {
  console.log(`hi cell${i},${j},${elbtn} `);
}

// looping negs
function loopingOnNegs(board, pos) {
  var negs = [];
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= board.length) continue; //check if dont get outside of the board [i]
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= board[i].length) continue; //check if dont get outside of the board [j]
      if (i === pos.i && j === pos.j) continue; //check if curCell
      if (board[i][j] /* condition*/) negs.push({ i: i, j: j });
    }
  }
  return negs;
}

// get Random Empty Cell (board)
// function getRandomEmptyCell(board) {
//   var emptyCells = [];
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       // if (board[i][j] === clean){
//       emptyCells.push({ i: i, j: j });
//     }
//   }
//   var randIdx = getRandomInt(0, emptyCells.length);
//   return emptyCells[randIdx];
// }

// getRandomInt(min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// getRandomColor
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// playSound(file)
function playSound(file) {
  var audio = new Audio(file);
  audio.play();
}

//  printPrimaryDiagonal(mat)
function printPrimaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][d];
    console.log(item);
  }
}

// printSecondaryDiagonal(mat)
function printSecondaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][squareMat.length - 1 - d];
    console.log(item);
  }
}

// drawRandomNum(arr);
function drawRandomNum(arr) {
  var idx = getRandomInt(0, arr.length);
  var num = arr[idx];
  arr.splice(idx, 1);
  return num;
}

// copyMat(mat)
function copyMat(mat) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = [];
    for (var j = 0; j < mat.length; j++) {
      newMat[i][j] = mat[i][j];
    }
  }
  return newMat;
}

// timer
function startTimeInterval() {
  gStartTime = Date.now();

  gIntervalID = setInterval(function () {
    var elTimer = document.querySelector('.timer');
    var miliSecs = Date.now() - gStartTime;
    elTimer.innerText = (miliSecs / 1000).toFixed(3);
  }, 10);
}

//   toggleGame(elBtn)
//   function toggleGame(elBtn) {
//     if (gGameInterval) {
//       clearInterval(gGameInterval);
//       gGameInterval = null;
//       elBtn.innerText = 'Play';
//     } else {
//       gGameInterval = setInterval(play, GAME_FREQ);
//       elBtn.innerText = 'Pause';
//     }
//   }

// function createBoard(size) {
//     var board = [];
//     for (var i = 0; i < size; i++) {
//       board.push([]);
//       for (var j = 0; j < size; j++) {
//         board[i][j] = '';
//       }
//     }
//     return board;
//   }
// *********************************************************************************************************************************

// *****************************************************************************************************************************
//
