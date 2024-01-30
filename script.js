document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleCellClick);
      cells.push(cell);
      board.appendChild(cell);
    }
  }

  let currentPlayer = 'X';
  let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  let lastUserMove = null;
  let lastAiMove = null;
  let gameMode = 'ai'; // 'ai' for AI vs. Human, 'human' for Human vs. Human

  function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (gameBoard[row][col] === '' && (gameMode === 'human' || (gameMode === 'ai' && currentPlayer === 'X'))) {
      gameBoard[row][col] = currentPlayer;
      cell.textContent = currentPlayer;
      lastUserMove = {
        row,
        col
      };

      if (checkWinner(currentPlayer)) {
        setTimeout(() => {
          updateLastMove();
          alert(`${currentPlayer} wins!`);
          resetGame();
        }, 500);
      } else if (checkTie()) {
        setTimeout(() => {
          updateLastMove();
          alert("It's a tie!");
          resetGame();
        }, 500);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (gameMode === 'ai' && currentPlayer === 'O') {
          setTimeout(() => {
            makeAiMove();
          }, 1000);
        }
      }
    } else {
      alert('Invalid move. Cell already taken or it\'s AI\'s turn.');
    }
  }

  function makeAiMove() {
    const bestMove = findBestMove();
    const aiRow = bestMove.row;
    const aiCol = bestMove.col;

    const aiCell = cells.find(
      cell =>
        parseInt(cell.dataset.row) === aiRow &&
        parseInt(cell.dataset.col) === aiCol
    );

    gameBoard[aiRow][aiCol] = 'O';
    aiCell.textContent = 'O';
    lastAiMove = {
      row: aiRow,
      col: aiCol
    };

    if (checkWinner('O')) {
      setTimeout(() => {
        updateLastMove();
        alert('AI wins!');
        resetGame();
      }, 500);
    } else if (checkTie()) {
      setTimeout(() => {
        updateLastMove();
        alert("It's a tie!");
        resetGame();
      }, 500);
    } else {
      currentPlayer = 'X';
    }
  }

  function updateLastMove() {
    if (lastUserMove) {
      const lastUserCell = cells.find(
        cell =>
          parseInt(cell.dataset.row) === lastUserMove.row &&
          parseInt(cell.dataset.col) === lastUserMove.col
      );
      lastUserCell.classList.add('last-user-move');
    }

    if (lastAiMove) {
      const lastAiCell = cells.find(
        cell =>
          parseInt(cell.dataset.row) === lastAiMove.row &&
          parseInt(cell.dataset.col) === lastAiMove.col
      );
      lastAiCell.classList.add('last-ai-move');
    }
  }

  function findBestMove() {
    function findBestMove() {
      let bestVal = -Infinity;
      let bestMove = {
        row: -1,
        col: -1
      };
    
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (gameBoard[i][j] === '') {
            gameBoard[i][j] = 'O';
            const moveVal = minimax(gameBoard, 0, false);
            gameBoard[i][j] = '';
    
            if (moveVal > bestVal) {
              bestMove.row = i;
              bestMove.col = j;
              bestVal = moveVal;
            }
          }
        }
      }
    
      return bestMove;
    }
    
    function minimax(board, depth, isMaximizing) {
      const scores = {
        X: -1,
        O: 1,
        tie: 0
      };
    
      const result = checkGameOver();
      if (result !== null) {
        return scores[result];
      }
    
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
              board[i][j] = 'O';
              const score = minimax(board, depth + 1, false);
              board[i][j] = '';
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
              board[i][j] = 'X';
              const score = minimax(board, depth + 1, true);
              board[i][j] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }
    
  }

  function checkWinner(player) {
    for (let i = 0; i < 3; i++) {
      if (
        (gameBoard[i][0] === player && gameBoard[i][1] === player && gameBoard[i][2] === player) ||
        (gameBoard[0][i] === player && gameBoard[1][i] === player && gameBoard[2][i] === player)
      ) {
        return true;
      }
    }

    if (
      (gameBoard[0][0] === player && gameBoard[1][1] === player && gameBoard[2][2] === player) ||
      (gameBoard[0][2] === player && gameBoard[1][1] === player && gameBoard[2][0] === player)
    ) {
      return true;
    }

    return false;
  }

  function checkTie() {
    for (const row of gameBoard) {
      if (row.includes('')) {
        return false;
      }
    }
    return true;
  }

  function resetGame() {
    gameBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('last-user-move', 'last-ai-move');
    });

    lastUserMove = null;
    lastAiMove = null;
    currentPlayer = 'X';
  }

  // Function to switch between game modes (AI vs. Human and Human vs. Human)
  window.switchGameMode = function (mode) {
    gameMode = mode;
    resetGame();
  };
});
