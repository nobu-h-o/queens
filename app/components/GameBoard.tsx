'use client';

import { GameState, Position } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  selectedCell: Position | null;
  onCellClick: (row: number, col: number) => void;
  isGameWon: boolean;
}

const REGION_COLORS = [
  'bg-red-300 dark:bg-red-700',          // Red
  'bg-sky-300 dark:bg-sky-700',          // Sky Blue (distinct from other blues)
  'bg-green-300 dark:bg-green-700',      // Green
  'bg-yellow-300 dark:bg-yellow-700',    // Yellow
  'bg-purple-300 dark:bg-purple-700',    // Purple
  'bg-orange-300 dark:bg-orange-700',    // Orange
  'bg-pink-300 dark:bg-pink-700',        // Pink
  'bg-teal-300 dark:bg-teal-700',        // Teal
  'bg-gray-300 dark:bg-gray-600',        // Gray
  'bg-indigo-300 dark:bg-indigo-700',    // Indigo
];

const GameBoard = ({ 
  gameState, 
  selectedCell, 
  onCellClick,
  isGameWon 
}: GameBoardProps) => {
  const { board, size } = gameState;

  const getCellContent = (row: number, col: number) => {
    const cell = board[row][col];
    
    switch (cell.state) {
      case 'queen':
        return <span className="text-2xl sm:text-3xl">👑</span>;
      case 'blocked':
        return <span className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-300">×</span>;
      default:
        return null;
    }
  };

  const getCellClasses = (row: number, col: number) => {
    const cell = board[row][col];
    const baseClasses = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md rounded-sm touch-manipulation border border-gray-400/20';
    
    // Region color
    const regionColor = REGION_COLORS[cell.region % REGION_COLORS.length];
    
    // Region border logic - add thick borders at region boundaries
    let borderClasses = '';
    const currentRegion = cell.region;
    
    // Check top border
    if (row === 0 || board[row - 1][col].region !== currentRegion) {
      borderClasses += ' border-t-4 border-t-black';
    }
    
    // Check bottom border
    if (row === size - 1 || board[row + 1][col].region !== currentRegion) {
      borderClasses += ' border-b-4 border-b-black';
    }
    
    // Check left border
    if (col === 0 || board[row][col - 1].region !== currentRegion) {
      borderClasses += ' border-l-4 border-l-black';
    }
    
    // Check right border
    if (col === size - 1 || board[row][col + 1].region !== currentRegion) {
      borderClasses += ' border-r-4 border-r-black';
    }
    
    // Additional states
    let stateClasses = '';
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      stateClasses += ' ring-2 ring-blue-500';
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

    return `${baseClasses} ${regionColor} ${borderClasses} ${stateClasses}`;
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

    // Only check adjacent diagonal cells (touching), not full diagonal lines
    // This allows queens like (0,0) and (2,2) but prevents (0,0) and (1,1)

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
    <div className="inline-block bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg max-w-full">
      <div 
        className="grid gap-0.5 p-2 bg-gray-800 dark:bg-gray-800 rounded-lg touch-manipulation"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: '95vw'
        }}
      >
        {Array.from({ length: size }, (_, row) =>
          Array.from({ length: size }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={getCellClasses(row, col)}
              onClick={() => onCellClick(row, col)}
              role="button"
              tabIndex={0}
              aria-label={`Cell ${row + 1}, ${col + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCellClick(row, col);
                }
              }}
            >
              {getCellContent(row, col)}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 text-center">
        <p>Click to cycle: Empty → × → 👑 → Empty</p>
      </div>
    </div>
  );
};

export default GameBoard;