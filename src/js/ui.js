import { clearHighlights, highlightPossibleMoves, renderBoard } from './board.js';
import { getPossibleMoves } from './pieces.js';
import { nextTurn, resetGame } from './zombies.js';

// Selected cell and possible moves
let selectedCell = null;

// Set up event listeners
export function setupEventListeners() {
    // Get UI elements
    const resetButton = document.getElementById('reset-button');
    
    // Add event listeners
    resetButton.addEventListener('click', handleResetClick);
}

// Handle reset button click
function handleResetClick() {
    resetGame();
    selectedCell = null;
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
            // Move the piece
            movePiece(selectedCell.row, selectedCell.col, row, col);
            
            // Check win condition - King reached the top row
            if (board[row][col] === '♔' && row === 0) {
                window.gameState.gameOver = true;
                const statusElement = document.getElementById('status');
                statusElement.textContent = 'Congratulations! You won!';
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

// Move a piece
function movePiece(fromRow, fromCol, toRow, toCol) {
    const { board } = window.gameState;
    
    // Check if capturing a zombie
    if (['♟', '♜', '♞', '♝'].includes(board[toRow][toCol])) {
        window.gameState.zombieCount--;
    }
    
    // Move the piece
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
    
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
