// Import modules
import { createBoard, renderBoard } from './board.js';
import { setupEventListeners } from './ui.js';
import { initializeGameState, resetGame } from './zombies.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game state
    initializeGameState();
    
    // Create and render the board
    createBoard();
    renderBoard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI counters
    updateCounters();
});

// Export function to update counters
export function updateCounters() {
    const turnCounterElement = document.getElementById('turn-counter');
    const zombieCounterElement = document.getElementById('zombie-counter');
    const piecesCounterElement = document.getElementById('pieces-counter');
    
    const { turn, zombieCount, playerPieces } = getGameState();
    
    turnCounterElement.textContent = turn;
    zombieCounterElement.textContent = zombieCount;
    piecesCounterElement.textContent = playerPieces;
}

// Export function to get game state
export function getGameState() {
    return {
        turn: window.gameState.turn,
        zombieCount: window.gameState.zombieCount,
        playerPieces: window.gameState.playerPieces,
        gameOver: window.gameState.gameOver
    };
}