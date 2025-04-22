import { clearHighlights, highlightPossibleMoves, renderBoard } from './board.js';
import { getPossibleMoves } from './pieces.js';
import { nextTurn, resetGame } from './zombies.js';

// Helper functions for move notation
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Piece symbols for notation
const PIECE_NOTATION = {
    '♔': 'K', // King
    '♕': 'Q', // Queen
    '♖': 'R', // Rook
    '♗': 'B', // Bishop
    '♘': 'N', // Knight
    '♙': 'P', // Pawn
    '♛': 'Q', // Zombie Queen
    '♜': 'R', // Zombie Rook
    '♝': 'B', // Zombie Bishop
    '♞': 'N', // Zombie Knight
    '♟': 'P'  // Zombie Pawn
};

// Selected cell and possible moves
let selectedCell = null;

// Undo/Redo stacks
let undoStack = [];
let redoStack = [];

// Store last move
let lastMove = null;

// Onboarding overlay logic
window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('chesszombie_onboarded')) {
        document.getElementById('onboarding-overlay').style.display = 'flex';
    }
    document.getElementById('close-onboarding').onclick = () => {
        document.getElementById('onboarding-overlay').style.display = 'none';
        localStorage.setItem('chesszombie_onboarded', '1');
    };
});

// Sound helpers
function playSound(id) {
    const el = document.getElementById(id);
    if (el) { el.currentTime = 0; el.play(); }
}

// Set up event listeners
export function setupEventListeners() {
    // Get UI elements
    const resetButton = document.getElementById('reset-button');
    const difficultySelect = document.getElementById('difficulty');
    const hintButton = document.getElementById('hint-button');
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');

    // Add event listeners
    resetButton.addEventListener('click', handleResetClick);
    if (difficultySelect) {
        difficultySelect.addEventListener('change', handleDifficultyChange);
    }
    if (hintButton) hintButton.addEventListener('click', handleHintClick);
    if (undoButton) undoButton.addEventListener('click', handleUndoClick);
    if (redoButton) redoButton.addEventListener('click', handleRedoClick);
}

// Hint button handler
function handleHintClick() {
    // If a piece is selected, highlight a random possible move
    if (selectedCell && window.gameState.possibleMoves.length > 0) {
        const move = window.gameState.possibleMoves[Math.floor(Math.random() * window.gameState.possibleMoves.length)];
        const cell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
        if (cell) {
            cell.classList.add('last-move');
            setTimeout(() => cell.classList.remove('last-move'), 700);
        }
    } else {
        // Otherwise, select a random player piece and highlight a move
        const { board } = window.gameState;
        let playerPieces = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] && !['♟', '♜', '♞', '♝', '♛'].includes(board[r][c])) {
                    playerPieces.push({ row: r, col: c });
                }
            }
        }
        if (playerPieces.length > 0) {
            const piece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
            selectCell(piece.row, piece.col);
            setTimeout(() => handleHintClick(), 100); // recurse to highlight
        }
    }
}

// Undo/Redo logic
function cloneState() {
    return JSON.parse(JSON.stringify(window.gameState));
}

function restoreState(state) {
    window.gameState = JSON.parse(JSON.stringify(state));
    renderBoard();
    updateMoveHistoryUI();
    updateCounters();
}

function handleUndoClick() {
    if (undoStack.length > 0) {
        redoStack.push(cloneState());
        const prev = undoStack.pop();
        restoreState(prev);
    }
}

function handleRedoClick() {
    if (redoStack.length > 0) {
        undoStack.push(cloneState());
        const next = redoStack.pop();
        restoreState(next);
    }
}


// Handle reset button click
function handleResetClick() {
    resetGame();
    selectedCell = null;
}

// Handle difficulty change
function handleDifficultyChange(event) {
    // Update game state with new difficulty
    window.gameState.difficulty = event.target.value;
    
    // Reset the game with the new difficulty
    resetGame();
}

// Handle next turn button click
function handleNextTurnClick() {
    if (window.gameState.gameOver) return;
    
    nextTurn();
    selectedCell = null;
    clearHighlights();
}

// Handle cell click
export function handleCellClick(event) {
    // Remove last-move highlights
    document.querySelectorAll('.cell.last-move').forEach(cell => cell.classList.remove('last-move'));

    if (window.gameState.gameOver) return;
    
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const { board } = window.gameState;
    
    // If a cell is already selected
    if (selectedCell) {
        // Check if the clicked cell is a possible move
        const moveIndex = window.gameState.possibleMoves.findIndex(move => 
            move.row === row && move.col === col);
        
        if (moveIndex !== -1) {
            // Save state for undo
            undoStack.push(cloneState());
            redoStack = [];

            // Animate last move
            animateMove(selectedCell.row, selectedCell.col, row, col, board);

            movePiece(selectedCell.row, selectedCell.col, row, col);
            playSound('move-sound');

            // Highlight last move
            highlightLastMove(selectedCell.row, selectedCell.col, row, col);

            // Check win condition - King reached the top row
            if (board[row][col] === '♔' && row === 0) {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Congratulations! You won!';
                playSound('gameover-sound');
            }

            // Reset selection
            selectedCell = null;
            window.gameState.possibleMoves = [];
            clearHighlights();
        } else {
            // Deselect if clicking on a non-move cell
            selectedCell = null;
            window.gameState.possibleMoves = [];
            clearHighlights();
            
            // If clicking on own piece, select it
            if (board[row][col] && !['♟', '♜', '♞', '♝'].includes(board[row][col])) {
                selectCell(row, col);
            }
        }
    } else {
        // If no cell is selected and clicking on own piece
        if (board[row][col] && !['♟', '♜', '♞', '♝'].includes(board[row][col])) {
            selectCell(row, col);
        }
    }
}

// Select a cell
function selectCell(row, col) {
    const { board } = window.gameState;
    selectedCell = { row, col };
    
    // Highlight the selected cell
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('selected');
    
    // Get possible moves
    window.gameState.possibleMoves = getPossibleMoves(row, col, board[row][col], board);
    
    // Highlight possible moves
    highlightPossibleMoves(window.gameState.possibleMoves);
}

// Animate move/capture
function animateMove(fromRow, fromCol, toRow, toCol, board) {
    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    if (toCell && board[toRow][toCol]) {
        toCell.classList.add('animate-capture');
        playSound('capture-sound');
        setTimeout(() => toCell.classList.remove('animate-capture'), 300);
    } else if (fromCell && toCell) {
        toCell.classList.add('animate-move');
        setTimeout(() => toCell.classList.remove('animate-move'), 300);
    }
}

// Highlight last move
function highlightLastMove(fromRow, fromCol, toRow, toCol) {
    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    if (fromCell) fromCell.classList.add('last-move');
    if (toCell) toCell.classList.add('last-move');
    setTimeout(() => {
        if (fromCell) fromCell.classList.remove('last-move');
        if (toCell) toCell.classList.remove('last-move');
    }, 900);
}

// Move a piece
function movePiece(fromRow, fromCol, toRow, toCol) {
    const { board } = window.gameState;
    
    // Get the piece being moved
    const piece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];
    
    // Check if capturing a zombie
    if (['♟', '♜', '♞', '♝', '♛'].includes(capturedPiece)) {
        window.gameState.zombieCount--;
    }
    
    // Move the piece
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    
    // Add to move history
    addMoveToHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
    
    // Update the board
    renderBoard();
    
    // Automatically trigger zombie turn after player move
    // Add a small delay to allow the player to see their move
    setTimeout(() => {
        if (!window.gameState.gameOver) {
            nextTurn();
        }
    }, 500);
}

// Add move to history
function addMoveToHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece) {
    // Get the move list element
    const moveListElement = document.getElementById('move-list');
    if (!moveListElement) return;
    
    // Convert board coordinates to chess notation
    const fromSquare = FILES[fromCol] + RANKS[fromRow];
    const toSquare = FILES[toCol] + RANKS[toRow];
    
    // Create notation for the move
    let notation = '';
    
    // Add piece symbol (except for pawns)
    if (piece !== '♙') {
        notation += PIECE_NOTATION[piece];
    }
    
    // Add from square
    notation += fromSquare;
    
    // Add capture symbol if applicable
    if (capturedPiece) {
        notation += 'x';
    } else {
        notation += '-';
    }
    
    // Add to square
    notation += toSquare;
    
    // Add the move to the game state history
    if (!window.gameState.moveHistory) {
        window.gameState.moveHistory = [];
    }
    
    // Add player move to history
    window.gameState.moveHistory.push({
        turn: window.gameState.turn,
        notation: notation,
        isZombie: false
    });
    
    // Create a new move entry in the UI
    updateMoveHistoryUI();
}

// Add zombie move to history
export function addZombieMoveToHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece) {
    // Convert board coordinates to chess notation
    const fromSquare = FILES[fromCol] + RANKS[fromRow];
    const toSquare = FILES[toCol] + RANKS[toRow];
    
    // Create notation for the move
    let notation = '';
    
    // Add piece symbol (except for pawns)
    if (piece !== '♟') {
        notation += PIECE_NOTATION[piece];
    }
    
    // Add from square
    notation += fromSquare;
    
    // Add capture symbol if applicable
    if (capturedPiece) {
        notation += 'x';
    } else {
        notation += '-';
    }
    
    // Add to square
    notation += toSquare;
    
    // Add the move to the game state history
    if (!window.gameState.moveHistory) {
        window.gameState.moveHistory = [];
    }
    
    // Add zombie move to history
    window.gameState.moveHistory.push({
        turn: window.gameState.turn,
        notation: notation,
        isZombie: true
    });
    
    // Update the UI
    updateMoveHistoryUI();
}

// Update the move history UI
function updateMoveHistoryUI() {
    const moveListElement = document.getElementById('move-list');
    if (!moveListElement) return;
    
    // Clear the current list
    moveListElement.innerHTML = '';
    
    // Group moves by turn
    const movesByTurn = {};
    
    // Process all moves
    window.gameState.moveHistory.forEach(move => {
        if (!movesByTurn[move.turn]) {
            movesByTurn[move.turn] = {
                playerMove: null,
                zombieMove: null
            };
        }
        
        if (move.isZombie) {
            movesByTurn[move.turn].zombieMove = move.notation;
        } else {
            movesByTurn[move.turn].playerMove = move.notation;
        }
    });
    
    // Create entries for each turn
    Object.keys(movesByTurn).forEach(turn => {
        const moveEntry = document.createElement('div');
        moveEntry.className = 'move-entry';
        
        const moveNumber = document.createElement('div');
        moveNumber.className = 'move-number';
        moveNumber.textContent = turn + '.';
        
        const playerMove = document.createElement('div');
        playerMove.className = 'player-move';
        playerMove.textContent = movesByTurn[turn].playerMove || '';
        
        const zombieMove = document.createElement('div');
        zombieMove.className = 'zombie-move';
        zombieMove.textContent = movesByTurn[turn].zombieMove || '';
        
        moveEntry.appendChild(moveNumber);
        moveEntry.appendChild(playerMove);
        moveEntry.appendChild(zombieMove);
        
        moveListElement.appendChild(moveEntry);
    });
    
    // Scroll to the bottom of the move list
    moveListElement.scrollTop = moveListElement.scrollHeight;
}
