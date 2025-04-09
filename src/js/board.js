import { getGameState } from './game.js';
import { handleCellClick } from './ui.js';

// Create the chessboard
export function createBoard() {
    const boardElement = document.querySelector('.chessboard');
    if (boardElement) {
        boardElement.innerHTML = '';
    }
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            
            // Add goal class to the top row
            if (row === 0) {
                cell.classList.add('goal');
            }
            
            // Add data attributes for position
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add click event
            cell.addEventListener('click', handleCellClick);
            
            boardElement.appendChild(cell);
        }
    }
}

// Render the board based on current state
export function renderBoard() {
    const { board } = window.gameState;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            
            // Clear previous content
            cell.textContent = '';
            cell.classList.remove('zombie');
            
            // Add piece if exists
            if (board[row][col]) {
                cell.textContent = board[row][col];
                
                // Add zombie class to enemy pieces
                if (['♟', '♜', '♞', '♝'].includes(board[row][col])) {
                    cell.classList.add('zombie');
                }
            }
        }
    }
}

// Clear highlighted cells
export function clearHighlights() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('selected');
        cell.classList.remove('highlighted');
        cell.classList.remove('danger');
    });
}

// Highlight possible moves
export function highlightPossibleMoves(moves) {
    moves.forEach(move => {
        const moveCell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
        moveCell.classList.add('highlighted');
    });
}