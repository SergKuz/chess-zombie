// Check if a position is valid
export function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get possible moves for a piece
export function getPossibleMoves(row, col, piece, board) {
    const moves = [];
    
    switch (piece) {
        case '♔': // King
            // King can move one square in any direction
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    if (r === 0 && c === 0) continue; // Skip current position
                    
                    const newRow = row + r;
                    const newCol = col + c;
                    
                    if (isValidPosition(newRow, newCol)) {
                        // Can move to empty square or capture zombie
                        if (!board[newRow][newCol] || ['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }
            break;
            
        case '♙': // Pawn
            // Pawn can move forward one square
            if (isValidPosition(row - 1, col) && !board[row - 1][col]) {
                moves.push({ row: row - 1, col: col });
            }
            
            // Pawn can capture diagonally
            if (isValidPosition(row - 1, col - 1) && ['♟', '♜', '♞', '♝'].includes(board[row - 1][col - 1])) {
                moves.push({ row: row - 1, col: col - 1 });
            }
            
            if (isValidPosition(row - 1, col + 1) && ['♟', '♜', '♞', '♝'].includes(board[row - 1][col + 1])) {
                moves.push({ row: row - 1, col: col + 1 });
            }
            break;
            
        case '♖': // Rook
            // Rook can move horizontally and vertically
            const rookDirections = [
                { row: -1, col: 0 }, // up
                { row: 1, col: 0 },  // down
                { row: 0, col: -1 }, // left
                { row: 0, col: 1 }   // right
            ];
            
            for (const dir of rookDirections) {
                let newRow = row + dir.row;
                let newCol = col + dir.col;
                
                while (isValidPosition(newRow, newCol)) {
                    if (!board[newRow][newCol]) {
                        // Empty square
                        moves.push({ row: newRow, col: newCol });
                    } else if (['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                        // Can capture zombie
                        moves.push({ row: newRow, col: newCol });
                        break;
                    } else {
                        // Blocked by own piece
                        break;
                    }
                    
                    newRow += dir.row;
                    newCol += dir.col;
                }
            }
            break;
            
        case '♘': // Knight
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
            
            for (const move of knightMoves) {
                const newRow = row + move.row;
                const newCol = col + move.col;
                
                if (isValidPosition(newRow, newCol)) {
                    if (!board[newRow][newCol] || ['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            break;
            
        case '♗': // Bishop
            // Bishop moves diagonally
            const bishopDirections = [
                { row: -1, col: -1 }, // up-left
                { row: -1, col: 1 },  // up-right
                { row: 1, col: -1 },  // down-left
                { row: 1, col: 1 }    // down-right
            ];
            
            for (const dir of bishopDirections) {
                let newRow = row + dir.row;
                let newCol = col + dir.col;
                
                while (isValidPosition(newRow, newCol)) {
                    if (!board[newRow][newCol]) {
                        // Empty square
                        moves.push({ row: newRow, col: newCol });
                    } else if (['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                        // Can capture zombie
                        moves.push({ row: newRow, col: newCol });
                        break;
                    } else {
                        // Blocked by own piece
                        break;
                    }
                    
                    newRow += dir.row;
                    newCol += dir.col;
                }
            }
            break;
            
        case '♕': // Queen
            // Queen can move like a rook and bishop combined
            const queenDirections = [
                { row: -1, col: 0 },  // up
                { row: 1, col: 0 },   // down
                { row: 0, col: -1 },  // left
                { row: 0, col: 1 },   // right
                { row: -1, col: -1 }, // up-left
                { row: -1, col: 1 },  // up-right
                { row: 1, col: -1 },  // down-left
                { row: 1, col: 1 }    // down-right
            ];
            
            for (const dir of queenDirections) {
                let newRow = row + dir.row;
                let newCol = col + dir.col;
                
                while (isValidPosition(newRow, newCol)) {
                    if (!board[newRow][newCol]) {
                        // Empty square
                        moves.push({ row: newRow, col: newCol });
                    } else if (['♟', '♜', '♞', '♝'].includes(board[newRow][newCol])) {
                        // Can capture zombie
                        moves.push({ row: newRow, col: newCol });
                        break;
                    } else {
                        // Blocked by own piece
                        break;
                    }
                    
                    newRow += dir.row;
                    newCol += dir.col;
                }
            }
            break;
    }
    
    return moves;
}

// Move a piece
export function movePiece(fromRow, fromCol, toRow, toCol) {
    const { board } = window.gameState;
    
    // Check if capturing a zombie
    if (['♟', '♜', '♞', '♝'].includes(board[toRow][toCol])) {
        window.gameState.zombieCount--;
    }
    
    // Move the piece
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
}