import { isValidPosition } from './pieces.js';
import { renderBoard } from './board.js';
import { updateCounters } from './game.js';

// Initialize game state
export function initializeGameState() {
    // Initial board setup
    const initialBoard = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    ];
    
    // Create global game state
    window.gameState = {
        board: JSON.parse(JSON.stringify(initialBoard)),
        selectedCell: null,
        possibleMoves: [],
        turn: 1,
        gameOver: false,
        playerPieces: 7, // Not counting the king
        zombieCount: 0,
        zombieSpawnRate: 0.3,
        specialZombieChance: 0.2
    };
}

// Reset the game
export function resetGame() {
    // Initial board setup
    const initialBoard = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    ];
    
    // Reset game state
    window.gameState.board = JSON.parse(JSON.stringify(initialBoard));
    window.gameState.selectedCell = null;
    window.gameState.possibleMoves = [];
    window.gameState.turn = 1;
    window.gameState.gameOver = false;
    window.gameState.playerPieces = 7;
    window.gameState.zombieCount = 0;
    window.gameState.zombieSpawnRate = 0.3;
    window.gameState.specialZombieChance = 0.2;
    
    // Update UI
    const statusElement = document.getElementById('status');
    statusElement.textContent = "Move your King to the opposite side!";
    
    // Render board and update counters
    renderBoard();
    updateCounters();
}

// Process next turn
export function nextTurn() {
    if (window.gameState.gameOver) return;
    
    // Move existing zombies
    moveZombies();
    
    // Create new zombies
    spawnZombies();
    
    // Increase difficulty as turns progress
    if (window.gameState.turn % 5 === 0) {
        window.gameState.zombieSpawnRate = Math.min(0.7, window.gameState.zombieSpawnRate + 0.05);
        window.gameState.specialZombieChance = Math.min(0.4, window.gameState.specialZombieChance + 0.03);
    }
    
    // Update the board
    renderBoard();
    
    // Increase turn counter
    window.gameState.turn++;
    updateCounters();
    
    // Check if still in game
    if (!window.gameState.gameOver && window.gameState.playerPieces === 0) {
        window.gameState.gameOver = true;
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Game Over! You lost all your pieces!';
    }
}

// Handle zombie movement
function moveZombies() {
    const { board } = window.gameState;
    
    // Copy the board to avoid movement conflicts
    const boardCopy = JSON.parse(JSON.stringify(board));
    
    // Move each zombie
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            if (['♟', '♜', '♞', '♝'].includes(boardCopy[row][col])) {
                let moved = false;
                
                switch (boardCopy[row][col]) {
                    case '♟': // Pawn zombie
                        moved = moveZombiePawn(row, col);
                        break;
                    case '♜': // Rook zombie
                        moved = moveZombieRook(row, col);
                        break;
                    case '♞': // Knight zombie
                        moved = moveZombieKnight(row, col);
                        break;
                    case '♝': // Bishop zombie
                        moved = moveZombieBishop(row, col);
                        break;
                }
            }
        }
    }
}

// Move zombie pawn
function moveZombiePawn(row, col) {
    const { board } = window.gameState;
    
    // Zombie pawn moves down one square if possible
    if (row < 7 && !board[row + 1][col]) {
        board[row + 1][col] = board[row][col];
        board[row][col] = '';
        return true;
    }
    
    // Zombie pawn captures diagonally
    if (row < 7) {
        // Try left diagonal
        if (col > 0 && board[row + 1][col - 1] && !['♟', '♜', '♞', '♝'].includes(board[row + 1][col - 1])) {
            // Capture player piece
            if (board[row + 1][col - 1] !== '♔') {
                window.gameState.playerPieces--;
            } else {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Game Over! Your King was captured!';
            }
            
            board[row + 1][col - 1] = board[row][col];
            board[row][col] = '';
            return true;
        }
        
        // Try right diagonal
        if (col < 7 && board[row + 1][col + 1] && !['♟', '♜', '♞', '♝'].includes(board[row + 1][col + 1])) {
            // Capture player piece
            if (board[row + 1][col + 1] !== '♔') {
                window.gameState.playerPieces--;
            } else {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Game Over! Your King was captured!';
            }
            
            board[row + 1][col + 1] = board[row][col];
            board[row][col] = '';
            return true;
        }
    }
    
    return false;
}

// Move zombie rook
function moveZombieRook(row, col) {
    const { board } = window.gameState;
    
    // Find the king
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
    
    // Check if king is in the same row or column
    let canMoveToKing = false;
    let kingDirection = { row: 0, col: 0 };
    
    if (kingRow === row) {
        // King is in the same row
        canMoveToKing = true;
        kingDirection.col = kingCol > col ? 1 : -1;
        
        // Check if path is clear
        for (let c = col + kingDirection.col; c !== kingCol; c += kingDirection.col) {
            if (board[row][c]) {
                canMoveToKing = false;
                break;
            }
        }
    } else if (kingCol === col) {
        // King is in the same column
        canMoveToKing = true;
        kingDirection.row = kingRow > row ? 1 : -1;
        
        // Check if path is clear
        for (let r = row + kingDirection.row; r !== kingRow; r += kingDirection.row) {
            if (board[r][col]) {
                canMoveToKing = false;
                break;
            }
        }
    }
    
    // If can move to king, do it
    if (canMoveToKing) {
        const newRow = row + kingDirection.row;
        const newCol = col + kingDirection.col;
        
        // Check if next step is the king
        if (board[newRow][newCol] === '♔') {
            window.gameState.gameOver = true;
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Game Over! Your King was captured!';
        } else if (board[newRow][newCol] && !['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
            // Capture player piece
            window.gameState.playerPieces--;
        }
        
        board[newRow][newCol] = board[row][col];
        board[row][col] = '';
        return true;
    }
    
    // If can't move to king, move randomly in a straight line
    const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
    ];
    
    // Shuffle directions
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    // Try each direction
    for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        
        if (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                // Move to empty cell
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            } else if (!['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                // Capture player piece
                if (board[newRow][newCol] === '♔') {
                    window.gameState.gameOver = true;
                    const statusElement = document.getElementById('status');
                    statusElement.textContent = 'Game Over! Your King was captured!';
                } else {
                    window.gameState.playerPieces--;
                }
                
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            }
        }
    }
    
    return false;
}

// Move zombie knight
function moveZombieKnight(row, col) {
    const { board } = window.gameState;
    
    // Knight moves in L-shape
    const knightMoves = [
        { row: -2, col: -1 },
        { row: -2, col: 1 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 }
    ];
    
    // Find the king
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
    
    // Check if any move can attack the king
    let kingAttackMove = null;
    for (const move of knightMoves) {
        const newRow = row + move.row;
        const newCol = col + move.col;
        
        if (isValidPosition(newRow, newCol) && board[newRow][newCol] === '♔') {
            kingAttackMove = { row: newRow, col: newCol };
            break;
        }
    }
    
    // If can attack king, do it
    if (kingAttackMove) {
        window.gameState.gameOver = true;
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Game Over! Your King was captured!';
        board[kingAttackMove.row][kingAttackMove.col] = board[row][col];
        board[row][col] = '';
        return true;
    }
    
    // Shuffle moves for randomness
    for (let i = knightMoves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [knightMoves[i], knightMoves[j]] = [knightMoves[j], knightMoves[i]];
    }
    
    // Try to capture a piece or move to empty square
    for (const move of knightMoves) {
        const newRow = row + move.row;
        const newCol = col + move.col;
        
        if (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                // Move to empty cell
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            } else if (!['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                // Capture player piece
                if (board[newRow][newCol] === '♔') {
                    window.gameState.gameOver = true;
                    const statusElement = document.getElementById('status');
                    statusElement.textContent = 'Game Over! Your King was captured!';
                } else {
                    window.gameState.playerPieces--;
                }
                
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            }
        }
    }
    
    return false;
}

// Move zombie bishop
function moveZombieBishop(row, col) {
    const { board } = window.gameState;
    
    // Bishop moves diagonally
    const directions = [
        { row: -1, col: -1 }, // up-left
        { row: -1, col: 1 },  // up-right
        { row: 1, col: -1 },  // down-left
        { row: 1, col: 1 }    // down-right
    ];
    
    // Find the king
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
    
    // Check if king is on a diagonal
    let canMoveToKing = false;
    let kingDirection = { row: 0, col: 0 };
    
    if (Math.abs(kingRow - row) === Math.abs(kingCol - col)) {
        // King is on a diagonal
        canMoveToKing = true;
        kingDirection.row = kingRow > row ? 1 : -1;
        kingDirection.col = kingCol > col ? 1 : -1;
        
        // Check if path is clear
        let r = row + kingDirection.row;
        let c = col + kingDirection.col;
        while (r !== kingRow && c !== kingCol) {
            if (board[r][c]) {
                canMoveToKing = false;
                break;
            }
            r += kingDirection.row;
            c += kingDirection.col;
        }
    }
    
    // If can move to king, do it
    if (canMoveToKing) {
        const newRow = row + kingDirection.row;
        const newCol = col + kingDirection.col;
        
        // Check if next step is the king
        if (board[newRow][newCol] === '♔') {
            window.gameState.gameOver = true;
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Game Over! Your King was captured!';
        } else if (board[newRow][newCol] && !['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
            // Capture player piece
            window.gameState.playerPieces--;
        }
        
        board[newRow][newCol] = board[row][col];
        board[row][col] = '';
        return true;
    }
    
    // Shuffle directions for randomness
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    // Try each direction
    for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        
        if (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                // Move to empty cell
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            } else if (!['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                // Capture player piece
                if (board[newRow][newCol] === '♔') {
                    window.gameState.gameOver = true;
                    const statusElement = document.getElementById('status');
                    statusElement.textContent = 'Game Over! Your King was captured!';
                } else {
                    window.gameState.playerPieces--;
                }
                
                board[newRow][newCol] = board[row][col];
                board[row][col] = '';
                return true;
            }
        }
    }
    
    return false;
}

// Spawn zombies on the top row
function spawnZombies() {
    const { board } = window.gameState;
    
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
        if (Math.random() < window.gameState.zombieSpawnRate) {
            // Decide zombie type (pawn vs special)
            if (Math.random() < window.gameState.specialZombieChance) {
                // Special zombie
                const specialTypes = ['♜', '♞', '♝']; // rook, knight, bishop
                const zombieType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
                board[0][col] = zombieType;
            } else {
                // Pawn zombie
                board[0][col] = '♟';
            }
            
            window.gameState.zombieCount++;
        }
    }
    
    updateCounters();
}