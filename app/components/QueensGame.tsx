'use client';

import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import { generatePuzzle, CellState, GameState, Position } from '../utils/gameLogic';

const QueensGame = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isGameWon, setIsGameWon] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isGameWon) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isGameWon]);

  const initializeGame = useCallback((newDifficulty?: 'easy' | 'medium' | 'hard') => {
    const diff = newDifficulty || difficulty;
    const size = diff === 'easy' ? 7 : diff === 'medium' ? 8 : 9;
    const puzzle = generatePuzzle(size);
    
    setGameState(puzzle);
    setSelectedCell(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsGameWon(false);
    setDifficulty(diff);
  }, [difficulty]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || isGameWon) return;

    const newBoard = gameState.board.map(r => [...r]);
    const currentCell = newBoard[row][col];

    // Single click: toggle X marker
    if (currentCell.state === 'empty') {
      newBoard[row][col] = { ...currentCell, state: 'blocked' };
      setMoves(prev => prev + 1);
    } else if (currentCell.state === 'blocked') {
      newBoard[row][col] = { ...currentCell, state: 'empty' };
      setMoves(prev => prev + 1);
    }

    setGameState({ ...gameState, board: newBoard });
  }, [gameState, isGameWon]);

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    if (!gameState || isGameWon) return;

    const newBoard = gameState.board.map(r => [...r]);
    const currentCell = newBoard[row][col];

    // Double click: toggle queen
    if (currentCell.state === 'empty' || currentCell.state === 'blocked') {
      newBoard[row][col] = { ...currentCell, state: 'queen' };
      setMoves(prev => prev + 1);
    } else if (currentCell.state === 'queen' && !currentCell.isHint) {
      newBoard[row][col] = { ...currentCell, state: 'empty' };
      setMoves(prev => prev + 1);
    }

    const updatedGameState = { ...gameState, board: newBoard };
    setGameState(updatedGameState);

    // Check win condition
    checkWinCondition(updatedGameState);
  }, [gameState, isGameWon]);

  const checkWinCondition = (state: GameState) => {
    const { board, size } = state;
    
    // Count queens per row, column, and region
    const rowQueens = Array(size).fill(0);
    const colQueens = Array(size).fill(0);
    const regionQueens: { [key: number]: number } = {};

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col].state === 'queen') {
          rowQueens[row]++;
          colQueens[col]++;
          const region = board[row][col].region;
          regionQueens[region] = (regionQueens[region] || 0) + 1;
        }
      }
    }

    // Check if all constraints are satisfied
    const allRowsHaveOneQueen = rowQueens.every(count => count === 1);
    const allColsHaveOneQueen = colQueens.every(count => count === 1);
    const allRegionsHaveOneQueen = Object.values(regionQueens).every(count => count === 1);
    const correctNumberOfQueens = Object.keys(regionQueens).length === state.regions.length;

    if (allRowsHaveOneQueen && allColsHaveOneQueen && allRegionsHaveOneQueen && correctNumberOfQueens) {
      setIsGameWon(true);
    }
  };

  const resetGame = useCallback(() => {
    if (!gameState) return;
    
    const resetBoard = gameState.board.map(row => 
      row.map(cell => ({
        ...cell,
        state: cell.isHint ? 'queen' : 'empty'
      }))
    );

    setGameState({ ...gameState, board: resetBoard });
    setSelectedCell(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsGameWon(false);
  }, [gameState]);

  const newGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const changeDifficulty = useCallback((newDifficulty: 'easy' | 'medium' | 'hard') => {
    initializeGame(newDifficulty);
  }, [initializeGame]);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading game...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GameControls
        moves={moves}
        timeElapsed={timeElapsed}
        difficulty={difficulty}
        onNewGame={newGame}
        onReset={resetGame}
        onDifficultyChange={changeDifficulty}
        isGameWon={isGameWon}
      />
      
      <div className="mt-8 flex justify-center">
        <GameBoard
          gameState={gameState}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          onCellDoubleClick={handleCellDoubleClick}
          isGameWon={isGameWon}
        />
      </div>

      {isGameWon && (
        <div className="mt-8 text-center">
          <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-green-700 dark:text-green-300">
              You solved the puzzle in {moves} moves and {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, '0')}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueensGame;