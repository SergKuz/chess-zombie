import { isValidPosition } from './pieces.js';
import { renderBoard } from './board.js';
import { updateCounters } from './game.js';
import { addZombieMoveToHistory } from './ui.js';

// Last zombie move for recording in history
let lastZombieMove = null;

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
    
    // Get difficulty setting
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medium';
    
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
        specialZombieChance: 0.2,
        // Add flag to prevent zombies from appearing on middle rows
        restrictMiddleRows: true,
        difficulty: difficulty,
        moveHistory: []
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
    
    // Get difficulty setting
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medium';
    
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
    window.gameState.restrictMiddleRows = true;
    window.gameState.difficulty = difficulty;
    window.gameState.moveHistory = [];
    
    // Update UI
    const statusElement = document.getElementById('status');
    statusElement.textContent = "Move your King to the opposite side!";
    
    // Clear move history
    const moveListElement = document.getElementById('move-list');
    if (moveListElement) {
        moveListElement.innerHTML = '';
    }
    
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
        
        // After turn 10, allow zombies to appear on middle rows
        if (window.gameState.turn >= 10) {
            window.gameState.restrictMiddleRows = false;
        }
    }
    
    // Record zombie move in history
    recordZombieMove();
    
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

// Function to record zombie moves in the move history
function recordZombieMove() {
    // If there's a last zombie move recorded, add it to the history
    if (lastZombieMove) {
        const { piece, fromRow, fromCol, toRow, toCol, capturedPiece } = lastZombieMove;
        addZombieMoveToHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
        lastZombieMove = null; // Reset after recording
    }
}

// Handle zombie movement
function moveZombies() {
    const { board } = window.gameState;
    
    // Find all zombies on the board
    const zombies = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (['♟', '♜', '♞', '♝', '♛'].includes(board[row][col])) {
                zombies.push({ row, col, type: board[row][col] });
            }
        }
    }
    
    // If there are zombies, move only one randomly
    if (zombies.length > 0) {
        // Select a random zombie to move
        const randomIndex = Math.floor(Math.random() * zombies.length);
        const zombie = zombies[randomIndex];
        
        // Move the selected zombie
        let moved = false;
        switch (zombie.type) {
            case '♟': // Pawn zombie
                moved = moveZombiePawn(zombie.row, zombie.col);
                break;
            case '♜': // Rook zombie
                moved = moveZombieRook(zombie.row, zombie.col);
                break;
            case '♞': // Knight zombie
                moved = moveZombieKnight(zombie.row, zombie.col);
                break;
            case '♝': // Bishop zombie
                moved = moveZombieBishop(zombie.row, zombie.col);
                break;
        }
    }
}

// Move zombie pawn
function moveZombiePawn(row, col) {
    const { board, restrictMiddleRows } = window.gameState;
    const zombiePiece = board[row][col];
    
    // Check if moving to middle rows is restricted
    const isMiddleRowRestricted = restrictMiddleRows && (row + 1 === 3 || row + 1 === 4);
    
    // Zombie pawn moves down one square if possible
    if (row < 7 && !board[row + 1][col] && !isMiddleRowRestricted) {
        // Store the move for recording in history
        lastZombieMove = {
            piece: zombiePiece,
            fromRow: row,
            fromCol: col,
            toRow: row + 1,
            toCol: col,
            capturedPiece: null
        };
        
        board[row + 1][col] = zombiePiece;
        board[row][col] = '';
        return true;
    }
    
    // Zombie pawn captures diagonally
    if (row < 7 && !isMiddleRowRestricted) {
        // Try left diagonal
        if (col > 0 && board[row + 1][col - 1] && !['♟', '♜', '♞', '♝', '♛'].includes(board[row + 1][col - 1])) {
            // Get the captured piece
            const capturedPiece = board[row + 1][col - 1];
            
            // Store the move for recording in history
            lastZombieMove = {
                piece: zombiePiece,
                fromRow: row,
                fromCol: col,
                toRow: row + 1,
                toCol: col - 1,
                capturedPiece: capturedPiece
            };
            
            // Capture player piece
            if (capturedPiece !== '♔') {
                window.gameState.playerPieces--;
            } else {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Game Over! Your King was captured!';
            }
            
            board[row + 1][col - 1] = zombiePiece;
            board[row][col] = '';
            return true;
        }
        
        // Try right diagonal
        if (col < 7 && board[row + 1][col + 1] && !['♟', '♜', '♞', '♝', '♛'].includes(board[row + 1][col + 1])) {
            // Get the captured piece
            const capturedPiece = board[row + 1][col + 1];
            
            // Store the move for recording in history
            lastZombieMove = {
                piece: zombiePiece,
                fromRow: row,
                fromCol: col,
                toRow: row + 1,
                toCol: col + 1,
                capturedPiece: capturedPiece
            };
            
            // Capture player piece
            if (capturedPiece !== '♔') {
                window.gameState.playerPieces--;
            } else {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Game Over! Your King was captured!';
            }
            
            board[row + 1][col + 1] = zombiePiece;
            board[row][col] = '';
            return true;
        }
    }
    
    return false;
}

// Move zombie rook
function moveZombieRook(row, col) {
    const { board, restrictMiddleRows } = window.gameState;
    
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
        
        // Check if moving to middle rows is restricted
        const isMiddleRowRestricted = restrictMiddleRows && (newRow === 3 || newRow === 4);
        
        if (isValidPosition(newRow, newCol) && !isMiddleRowRestricted) {
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
        
        // Check if moving to middle rows is restricted
        const isMiddleRowRestricted = restrictMiddleRows && (newRow === 3 || newRow === 4);
        
        if (isValidPosition(newRow, newCol) && !isMiddleRowRestricted) {
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
    const { board, difficulty } = window.gameState;
    
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
            // Decide zombie type based on difficulty
            if (difficulty === 'easy') {
                // Only pawn zombies in easy mode
                board[0][col] = '♟';
            } else if (difficulty === 'medium') {
                // Decide zombie type (pawn vs special)
                if (Math.random() < window.gameState.specialZombieChance) {
                    // Special zombie (rook, knight, bishop)
                    const specialTypes = ['♜', '♞', '♝'];
                    const zombieType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
                    board[0][col] = zombieType;
                } else {
                    // Pawn zombie
                    board[0][col] = '♟';
                }
            } else if (difficulty === 'hard') {
                // Hard mode includes queens
                if (Math.random() < window.gameState.specialZombieChance) {
                    // Special zombie (rook, knight, bishop, queen)
                    const specialTypes = ['♜', '♞', '♝', '♛']; // Added queen
                    const zombieType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
                    board[0][col] = zombieType;
                } else {
                    // Pawn zombie
                    board[0][col] = '♟';
                }
            }
            
            window.gameState.zombieCount++;
        }
    }
    
    updateCounters();
}