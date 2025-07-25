'use client';

import { GameState, Position } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  selectedCell: Position | null;
  onCellClick: (row: number, col: number) => void;
  onCellDoubleClick: (row: number, col: number) => void;
  isGameWon: boolean;
}

const REGION_COLORS = [
  'bg-red-200 dark:bg-red-800',
  'bg-blue-200 dark:bg-blue-800',
  'bg-green-200 dark:bg-green-800',
  'bg-yellow-200 dark:bg-yellow-800',
  'bg-purple-200 dark:bg-purple-800',
  'bg-pink-200 dark:bg-pink-800',
  'bg-indigo-200 dark:bg-indigo-800',
  'bg-orange-200 dark:bg-orange-800',
  'bg-teal-200 dark:bg-teal-800',
  'bg-cyan-200 dark:bg-cyan-800',
];

const GameBoard = ({ 
  gameState, 
  selectedCell, 
  onCellClick, 
  onCellDoubleClick,
  isGameWon 
}: GameBoardProps) => {
  const { board, size } = gameState;

  const getCellContent = (row: number, col: number) => {
    const cell = board[row][col];
    
    switch (cell.state) {
      case 'queen':
        return <span className="text-2xl">👑</span>;
      case 'blocked':
        return <span className="text-xl font-bold text-gray-600 dark:text-gray-300">×</span>;
      default:
        return null;
    }
  };

  const getCellClasses = (row: number, col: number) => {
    const cell = board[row][col];
    const baseClasses = 'w-12 h-12 border border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md';
    
    // Region color
    const regionColor = REGION_COLORS[cell.region % REGION_COLORS.length];
    
    // Additional states
    let stateClasses = '';
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      stateClasses += ' ring-2 ring-blue-500';
    }
    
    if (cell.isHint) {
      stateClasses += ' ring-2 ring-green-500';
    }

    if (isGameWon) {
      stateClasses += ' opacity-90';
    }

    // Check for conflicts (queens attacking each other)
    if (cell.state === 'queen' && !isGameWon) {
      if (hasConflict(row, col)) {
        stateClasses += ' ring-2 ring-red-500 animate-pulse';
      }
    }

    return `${baseClasses} ${regionColor} ${stateClasses}`;
  };

  const hasConflict = (row: number, col: number): boolean => {
    const cell = board[row][col];
    if (cell.state !== 'queen') return false;

    // Check row conflicts
    for (let c = 0; c < size; c++) {
      if (c !== col && board[row][c].state === 'queen') {
        return true;
      }
    }

    // Check column conflicts
    for (let r = 0; r < size; r++) {
      if (r !== row && board[r][col].state === 'queen') {
        return true;
      }
    }

    // Check diagonal conflicts
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < size && c >= 0 && c < size) {
        if (board[r][c].state === 'queen') {
          return true;
        }
        r += dr;
        c += dc;
      }
    }

    // Check adjacent cells (queens cannot touch)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].state === 'queen') {
          return true;
        }
      }
    }

    // Check region conflicts
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r !== row || c !== col) && 
            board[r][c].region === cell.region && 
            board[r][c].state === 'queen') {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div className="inline-block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: size }, (_, row) =>
          Array.from({ length: size }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={getCellClasses(row, col)}
              onClick={() => onCellClick(row, col)}
              onDoubleClick={() => onCellDoubleClick(row, col)}
              role="button"
              tabIndex={0}
              aria-label={`Cell ${row + 1}, ${col + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (e.detail === 2 || e.key === 'Enter') {
                    onCellDoubleClick(row, col);
                  } else {
                    onCellClick(row, col);
                  }
                }
              }}
            >
              {getCellContent(row, col)}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
        <p>Single click: Mark with ×</p>
        <p>Double click: Place/remove queen 👑</p>
      </div>
    </div>
  );
};

export default GameBoard;