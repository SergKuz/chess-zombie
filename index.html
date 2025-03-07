<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chess vs Zombies</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #1a1a2e;
      color: #e6e6e6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 600px;
      width: 100%;
    }
    
    .chessboard {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      width: 100%;
      max-width: 500px;
      aspect-ratio: 1/1;
      border: 2px solid #16213e;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      margin-bottom: 20px;
    }
    
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
      user-select: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .cell.white {
      background-color: #e3f6f5;
    }
    
    .cell.black {
      background-color: #bae8e8;
    }
    
    .cell.highlighted {
      background-color: #c1fba4;
    }
    
    .cell.selected {
      background-color: #ffd3b6;
    }
    
    .cell.danger {
      background-color: #ff7e67;
    }
    
    .cell.goal {
      background-color: #a0c4ff;
    }
    
    .game-info {
      background-color: #16213e;
      padding: 15px 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }
    
    .status {
      font-size: 18px;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .stats {
      display: flex;
      justify-content: space-around;
      font-size: 16px;
    }
    
    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
    }
    
    button {
      background-color: #2c73d2;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    button:hover {
      background-color: #0089ba;
    }
    
    h1 {
      margin: 0 0 20px 0;
      color: #ffd3b6;
      text-align: center;
    }
    
    .piece {
      cursor: grab;
    }
    
    .instructions {
      background-color: #16213e;
      padding: 15px 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-sizing: border-box;
      margin-top: 20px;
      font-size: 14px;
    }
    
    .zombie {
      color: #ff5e5b;
      text-shadow: 0 0 3px #ff0000;
    }
    
    @media (max-width: 500px) {
      .cell {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>Chess vs Zombies</h1>
    
    <div class="game-info">
      <div class="status" id="status">Move your King to the opposite side!</div>
      <div class="stats">
        <div>Turn: <span id="turn-counter">1</span></div>
        <div>Zombies: <span id="zombie-counter">0</span></div>
        <div>Pieces left: <span id="pieces-counter">7</span></div>
      </div>
    </div>
    
    <div class="chessboard" id="chessboard"></div>
    
    <div class="controls">
      <button id="reset-btn">New Game</button>
      <button id="next-turn-btn">End Turn</button>
    </div>
    
    <div class="instructions">
      <p><strong>Chess vs Zombies:</strong> Guide your King to the opposite side of the board!</p>
      <p>- Move your pieces as in standard chess</p>
      <p>- Zombies appear on the opposite side and move toward you each turn</p>
      <p>- Capture zombies with your pieces to survive</p>
      <p>- Zombies can capture your pieces (including your King - game over!)</p>
      <p>- Most zombies are pawns, but beware special zombies (knights, bishops, rooks)</p>
      <p>- When you end your turn, zombies will move and new ones may appear</p>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const chessboard = document.getElementById('chessboard');
      const statusElement = document.getElementById('status');
      const resetButton = document.getElementById('reset-btn');
      const nextTurnButton = document.getElementById('next-turn-btn');
      const turnCounterElement = document.getElementById('turn-counter');
      const zombieCounterElement = document.getElementById('zombie-counter');
      const piecesCounterElement = document.getElementById('pieces-counter');
      
      let selectedCell = null;
      let possibleMoves = [];
      let turn = 1;
      let gameOver = false;
      let playerPieces = 7; // 1 king + 6 pawns
      let zombieCount = 0;
      let zombieSpawnRate = 0.3; // chance to spawn a zombie in each empty top row cell
      let specialZombieChance = 0.2; // chance for a zombie to be special (knight, bishop, rook)
      
      // Piece types and their movements
      const pieceMovements = {
        pawn: {
          player: [[-1, 0]], // Move forward (up)
          zombie: [[1, 0]],  // Move forward (down)
          playerCaptureDirections: [[-1, -1], [-1, 1]], // Capture diagonally
          zombieCaptureDirections: [[1, -1], [1, 1]]    // Capture diagonally
        },
        rook: {
          directions: [[-1, 0], [1, 0], [0, -1], [0, 1]], // Up, down, left, right
          range: 7 // Can move up to 7 squares
        },
        knight: {
          directions: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
        },
        bishop: {
          directions: [[-1, -1], [-1, 1], [1, -1], [1, 1]], // Diagonals
          range: 7
        },
        king: {
          directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          range: 1
        }
      };
      
      // Initialize the board with pieces
      const initialBoard = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '', ''],
        ['', '', '', '♔', '', '', '', '']
      ];
      
      // Map pieces to their types
      const pieceTypes = {
        // Zombies (red)
        '♟': { type: 'pawn', isZombie: true },
        '♜': { type: 'rook', isZombie: true },
        '♞': { type: 'knight', isZombie: true },
        '♝': { type: 'bishop', isZombie: true },
        
        // Player pieces (white)
        '♙': { type: 'pawn', isPlayer: true },
        '♔': { type: 'king', isPlayer: true }
      };
      
      let board = JSON.parse(JSON.stringify(initialBoard));
      
      // Create the chessboard UI
      function createBoard() {
        chessboard.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            const isWhiteCell = (row + col) % 2 === 1;
            
            cell.className = `cell ${isWhiteCell ? 'white' : 'black'}`;
            
            // Add goal area highlighting
            if (row === 0) {
              cell.classList.add('goal');
            }
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add piece to cell if exists
            if (board[row][col]) {
              cell.innerHTML = board[row][col];
              
              // Add zombie class for styling
              if (pieceTypes[board[row][col]].isZombie) {
                cell.classList.add('zombie');
              }
              
              cell.classList.add('piece');
            }
            
            cell.addEventListener('click', handleCellClick);
            chessboard.appendChild(cell);
          }
        }
      }
      
      // Handle cell click events
      function handleCellClick(event) {
        if (gameOver) return;
        
        const cell = event.target.closest('.cell');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const piece = board[row][col];
        
        // Clear previous selections
        clearHighlights();
        
        // If already selected a piece and clicking on a valid move destination
        if (selectedCell && possibleMoves.some(move => move.row === row && move.col === col)) {
          // Move the piece
          movePiece(selectedCell.row, selectedCell.col, row, col);
          selectedCell = null;
          possibleMoves = [];
          
          // Check win condition
          if (board[0].includes('♔')) {
            gameOver = true;
            statusElement.textContent = 'You win! Your King reached the other side!';
            return;
          }
          
          return;
        }
        
        // Reset selection if clicking on empty cell
        if (!piece) {
          selectedCell = null;
          possibleMoves = [];
          return;
        }
        
        // Only allow selecting player's pieces
        if (piece && pieceTypes[piece].isPlayer) {
          selectedCell = { row, col, piece };
          cell.classList.add('selected');
          
          // Calculate possible moves
          possibleMoves = getPossibleMoves(row, col, piece);
          
          // Highlight possible moves
          possibleMoves.forEach(move => {
            const moveCell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            moveCell.classList.add('highlighted');
          });
        }
      }
      
      // Get possible moves for a piece
      function getPossibleMoves(row, col, piece) {
        const pieceInfo = pieceTypes[piece];
        const moves = [];
        
        if (pieceInfo.type === 'pawn') {
          const moveDirections = pieceMovements.pawn.player;
          const captureDirections = pieceMovements.pawn.playerCaptureDirections;
          
          // Regular moves (forward)
          for (const [dr, dc] of moveDirections) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
              moves.push({ row: newRow, col: newCol });
            }
          }
          
          // Capture moves (diagonal)
          for (const [dr, dc] of captureDirections) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (isValidPosition(newRow, newCol) && board[newRow][newCol] && 
                pieceTypes[board[newRow][newCol]].isZombie) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        } else if (pieceInfo.type === 'king') {
          const { directions, range } = pieceMovements.king;
          
          for (const [dr, dc] of directions) {
            for (let i = 1; i <= range; i++) {
              const newRow = row + dr * i;
              const newCol = col + dc * i;
              
              if (!isValidPosition(newRow, newCol)) break;
              
              const targetPiece = board[newRow][newCol];
              
              if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
              } else if (targetPiece && pieceTypes[targetPiece].isZombie) {
                moves.push({ row: newRow, col: newCol });
                break; // Can't move through pieces
              } else {
                break; // Can't move through own pieces
              }
            }
          }
        }
        
        return moves;
      }
      
      // Move a piece
      function movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol];
        const targetPiece = board[toRow][toCol];
        
        // If capturing a zombie
        if (targetPiece && pieceTypes[targetPiece].isZombie) {
          zombieCount--;
          updateCounters();
        }
        
        // Move the piece
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = '';
        
        // Update the UI
        createBoard();
      }
      
      // Handle zombie movement
      function moveZombies() {
        const zombiePositions = [];
        
        // Find all zombies on the board
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && pieceTypes[piece].isZombie) {
              zombiePositions.push({ row, col, piece });
            }
          }
        }
        
        // Move each zombie (from bottom to top to avoid collisions)
        zombiePositions.sort((a, b) => b.row - a.row).forEach(zombie => {
          const { row, col, piece } = zombie;
          
          // Skip if zombie has already been moved or captured
          if (!board[row][col] || board[row][col] !== piece) return;
          
          let moved = false;
          
          // Different movement patterns based on zombie type
          if (piece === '♟') { // Pawn zombie
            moved = moveZombiePawn(row, col);
          } else if (piece === '♜') { // Rook zombie
            moved = moveZombieRook(row, col);
          } else if (piece === '♞') { // Knight zombie
            moved = moveZombieKnight(row, col);
          } else if (piece === '♝') { // Bishop zombie
            moved = moveZombieBishop(row, col);
          }
        });
      }
      
      function moveZombiePawn(row, col) {
        // Try to move forward
        const moves = [];
        
        // Check capture moves first (diagonal down)
        for (const [dr, dc] of pieceMovements.pawn.zombieCaptureDirections) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (isValidPosition(newRow, newCol) && board[newRow][newCol] && 
              pieceTypes[board[newRow][newCol]].isPlayer) {
            moves.push({ row: newRow, col: newCol, isCapture: true });
          }
        }
        
        // Check forward move
        if (isValidPosition(row+1, col) && !board[row+1][col]) {
          moves.push({ row: row+1, col, isCapture: false });
        }
        
        // Prioritize captures, then forward movement
        const captureMove = moves.find(m => m.isCapture);
        const targetMove = captureMove || moves[0];
        
        if (targetMove) {
          if (targetMove.isCapture) {
            // Check if capturing the king
            if (board[targetMove.row][targetMove.col] === '♔') {
              gameOver = true;
              statusElement.textContent = 'Game Over! The zombies got your King!';
            } else {
              playerPieces--;
              updateCounters();
            }
          }
          
          // Move the zombie
          board[targetMove.row][targetMove.col] = board[row][col];
          board[row][col] = '';
          return true;
        }
        
        return false;
      }
      
      function moveZombieRook(row, col) {
        // Find the closest player piece in rook directions
        const directions = pieceMovements.rook.directions;
        let bestMove = null;
        let shortestDistance = Infinity;
        
        // Find player pieces in each direction
        for (const [dr, dc] of directions) {
          let distance = 1;
          
          while (distance <= 7) {
            const newRow = row + dr * distance;
            const newCol = col + dc * distance;
            
            if (!isValidPosition(newRow, newCol)) break;
            
            const targetPiece = board[newRow][newCol];
            
            if (!targetPiece) {
              // Keep searching, empty cell
              distance++;
            } else if (pieceTypes[targetPiece].isPlayer) {
              // Found a player piece, check distance
              if (distance < shortestDistance) {
                shortestDistance = distance;
                // Move one step toward the player
                bestMove = { row: row + dr, col: col + dc };
              }
              break;
            } else {
              // Found another zombie, stop in this direction
              break;
            }
          }
        }
        
        // If can't find a player piece, move down if possible
        if (!bestMove && isValidPosition(row+1, col) && !board[row+1][col]) {
          bestMove = { row: row+1, col };
        }
        
        // Make the move if possible
        if (bestMove && isValidPosition(bestMove.row, bestMove.col)) {
          if (board[bestMove.row][bestMove.col] && pieceTypes[board[bestMove.row][bestMove.col]].isPlayer) {
            // Capturing a player piece
            if (board[bestMove.row][bestMove.col] === '♔') {
              gameOver = true;
              statusElement.textContent = 'Game Over! The zombies got your King!';
            } else {
              playerPieces--;
              updateCounters();
            }
          }
          
          board[bestMove.row][bestMove.col] = board[row][col];
          board[row][col] = '';
          return true;
        }
        
        return false;
      }
      
      function moveZombieKnight(row, col) {
        const directions = pieceMovements.knight.directions;
        const possibleMoves = [];
        const captureMoves = [];
        
        // Check all knight moves
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
              possibleMoves.push({ row: newRow, col: newCol });
            } else if (pieceTypes[board[newRow][newCol]].isPlayer) {
              captureMoves.push({ row: newRow, col: newCol });
            }
          }
        }
        
        // Prioritize captures, then find move closest to king
        let targetMove = null;
        
        if (captureMoves.length > 0) {
          targetMove = captureMoves[0]; // Take first capture move
        } else if (possibleMoves.length > 0) {
          // Find king position
          let kingRow = -1, kingCol = -1;
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (board[r][c] === '♔') {
                kingRow = r;
                kingCol = c;
                break;
              }
            }
            if (kingRow !== -1) break;
          }
          
          // Move toward king if found
          if (kingRow !== -1) {
            targetMove = possibleMoves.reduce((closest, move) => {
              const currentDist = Math.abs(move.row - kingRow) + Math.abs(move.col - kingCol);
              const closestDist = Math.abs(closest.row - kingRow) + Math.abs(closest.col - kingCol);
              return currentDist < closestDist ? move : closest;
            }, possibleMoves[0]);
          } else {
            // Just take first move if king not found
            targetMove = possibleMoves[0];
          }
        }
        
        if (targetMove) {
          if (board[targetMove.row][targetMove.col] && pieceTypes[board[targetMove.row][targetMove.col]].isPlayer) {
            if (board[targetMove.row][targetMove.col] === '♔') {
              gameOver = true;
              statusElement.textContent = 'Game Over! The zombies got your King!';
            } else {
              playerPieces--;
              updateCounters();
            }
          }
          
          board[targetMove.row][targetMove.col] = board[row][col];
          board[row][col] = '';
          return true;
        }
        
        return false;
      }
      
      function moveZombieBishop(row, col) {
        // Find the closest player piece in diagonal directions
        const directions = pieceMovements.bishop.directions;
        let bestMove = null;
        let shortestDistance = Infinity;
        
        // Find player pieces in each direction
        for (const [dr, dc] of directions) {
          let distance = 1;
          
          while (distance <= 7) {
            const newRow = row + dr * distance;
            const newCol = col + dc * distance;
            
            if (!isValidPosition(newRow, newCol)) break;
            
            const targetPiece = board[newRow][newCol];
            
            if (!targetPiece) {
              // Keep searching, empty cell
              distance++;
            } else if (pieceTypes[targetPiece].isPlayer) {
              // Found a player piece, check distance
              if (distance < shortestDistance) {
                shortestDistance = distance;
                // Move one step toward the player
                bestMove = { row: row + dr, col: col + dc };
              }
              break;
            } else {
              // Found another zombie, stop in this direction
              break;
            }
          }
        }
        
        // If can't find a player piece, move down if possible
        if (!bestMove && isValidPosition(row+1, col) && !board[row+1][col]) {
          bestMove = { row: row+1, col };
        }
        
        // Make the move if possible
        if (bestMove && isValidPosition(bestMove.row, bestMove.col)) {
          if (board[bestMove.row][bestMove.col] && pieceTypes[board[bestMove.row][bestMove.col]].isPlayer) {
            // Capturing a player piece
            if (board[bestMove.row][bestMove.col] === '♔') {
              gameOver = true;
              statusElement.textContent = 'Game Over! The zombies got your King!';
            } else {
              playerPieces--;
              updateCounters();
            }
          }
          
          board[bestMove.row][bestMove.col] = board[row][col];
          board[row][col] = '';
          return true;
        }
        
        return false;
      }
      
      // Spawn zombies on the top row
      function spawnZombies() {
        // Find king position to avoid spawning next to it
        let kingRow = -1, kingCol = -1;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c] === '♔') {
              kingRow = r;
              kingCol = c;
              break;
            }
          }
          if (kingRow !== -1) break;
        }
        
        // Check top row for empty cells
        for (let col = 0; col < 8; col++) {
          // Don't spawn if cell is occupied
          if (board[0][col]) continue;
          
          // Don't spawn next to king if king is on first row
          if (kingRow === 0 && Math.abs(col - kingCol) <= 1) continue;
          
          // Random chance to spawn a zombie
          if (Math.random() < zombieSpawnRate) {
            // Decide zombie type (pawn vs special)
            if (Math.random() < specialZombieChance) {
              // Special zombie
              const specialTypes = ['♜', '♞', '♝']; // rook, knight, bishop
              const zombieType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
              board[0][col] = zombieType;
            } else {
              // Pawn zombie
              board[0][col] = '♟';
            }
            
            zombieCount++;
          }
        }
        
        updateCounters();
      }
      
      // Process next turn
      function nextTurn() {
        if (gameOver) return;
        
        // Move existing zombies
        moveZombies();
        
        // Create new zombies
        spawnZombies();
        
        // Increase difficulty as turns progress
        if (turn % 5 === 0) {
          zombieSpawnRate = Math.min(0.7, zombieSpawnRate + 0.05);
          specialZombieChance = Math.min(0.4, specialZombieChance + 0.03);
        }
        
        // Update the board
        createBoard();
        
        // Increase turn counter
        turn++;
        updateCounters();
        
        // Check if still in game
        if (!gameOver && playerPieces === 0) {
          gameOver = true;
          statusElement.textContent = 'Game Over! You lost all your pieces!';
        }
      }
      
      // Check if a position is valid
      function isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
      }
      
      // Clear highlighted cells
      function clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
          cell.classList.remove('selected');
          cell.classList.remove('highlighted');
          cell.classList.remove('danger');
        });
      }
      
      // Update counters
      function updateCounters() {
        turnCounterElement.textContent = turn;
        zombieCounterElement.textContent = zombieCount;
        piecesCounterElement.textContent = playerPieces;
      }
      
      // Reset the game
      function resetGame() {
        board = JSON.parse(JSON.stringify(initialBoard));
        selectedCell = null;
        possibleMoves = [];
        turn = 1;
        gameOver = false;
        playerPieces = 7;
        zombieCount = 0;
        zombieSpawnRate = 0.3;
        specialZombieChance = 0.2;
        
        statusElement.textContent = "Move your King to the opposite side!";
        createBoard();
        updateCounters();
      }
      
      // Event listeners
      resetButton.addEventListener('click', resetGame);
      nextTurnButton.addEventListener('click', nextTurn);
      
      // Initialize the game
      createBoard();
      updateCounters();
    });
  </script>
</body>
</html>
