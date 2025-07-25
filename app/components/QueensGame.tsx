'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import { generatePuzzle, CellState, GameState, Position } from '../utils/gameLogic';

export interface QueensGameRef {
  returnToStart: () => void;
}

const QueensGame = forwardRef<QueensGameRef>((props, ref) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isGameWon, setIsGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

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
    setStartTime(Date.now());
    setTimeElapsed(0);
    setIsGameWon(false);
    setDifficulty(diff);
    setGameStarted(true);
  }, [difficulty]);


  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || isGameWon) return;

    const newBoard = gameState.board.map(r => [...r]);
    const currentCell = newBoard[row][col];

    // Single click: toggle between empty, X marker, and queen
    if (currentCell.state === 'empty') {
      newBoard[row][col] = { ...currentCell, state: 'blocked' };
    } else if (currentCell.state === 'blocked') {
      newBoard[row][col] = { ...currentCell, state: 'queen' };
    } else if (currentCell.state === 'queen') {
      newBoard[row][col] = { ...currentCell, state: 'empty' };
    }

    const updatedGameState = { ...gameState, board: newBoard };
    setGameState(updatedGameState);

    // Check win condition if a queen was placed
    if (newBoard[row][col].state === 'queen') {
      checkWinCondition(updatedGameState);
    }
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
        state: 'empty' as CellState
      }))
    );

    setGameState({ ...gameState, board: resetBoard });
    setSelectedCell(null);
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

  const returnToStart = useCallback(() => {
    setGameStarted(false);
    setGameState(null);
    setSelectedCell(null);
    setTimeElapsed(0);
    setIsGameWon(false);
  }, []);

  useImperativeHandle(ref, () => ({
    returnToStart
  }), [returnToStart]);

  if (!gameStarted) {
    return (
      <div className="w-full flex flex-col items-center justify-start max-w-4xl mx-auto text-center px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Queens Puzzle! 👑
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Challenge your logic with this strategic puzzle game
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-4xl">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 flex-1 max-w-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              How to Play:
            </h3>
            <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Place one queen (👑) in each row</li>
              <li>• Place one queen in each column</li>
              <li>• Place one queen in each colored region</li>
              <li>• Queens cannot touch each other</li>
              <li>• Single click to mark cells with ✗</li>
              <li>• Double click or continue clicking to place queens</li>
            </ul>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 flex-1 max-w-lg flex flex-col items-center justify-center">
            <div className="space-y-6 w-full">
              <div>
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Choose Difficulty:
                </label>
                <div className="flex flex-col gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        difficulty === diff
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      <span className="text-sm ml-2">
                        ({diff === 'easy' ? '7×7' : diff === 'medium' ? '8×8' : '9×9'})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => initializeGame()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg w-full"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="w-full flex flex-col max-w-4xl mx-auto px-4 py-6">
      <div className="flex-shrink-0 mb-4">
        <GameControls
          timeElapsed={timeElapsed}
          difficulty={difficulty}
          onNewGame={newGame}
          onReset={resetGame}
          onDifficultyChange={changeDifficulty}
          isGameWon={isGameWon}
        />
      </div>
      
      <div className="flex justify-center mb-4">
        <GameBoard
          gameState={gameState}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          isGameWon={isGameWon}
        />
      </div>

      {isGameWon && (
        <div className="mt-4 text-center flex-shrink-0">
          <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-sm text-green-700 dark:text-green-300">
              You solved the puzzle in {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, '0')}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

QueensGame.displayName = 'QueensGame';

export default QueensGame;