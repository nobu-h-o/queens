'use client';

import { useRef } from 'react';
import QueensGame, { QueensGameRef } from './components/QueensGame';

export default function Home() {
  const gameRef = useRef<QueensGameRef>(null);

  const handleReturnToStart = () => {
    if (gameRef.current) {
      gameRef.current.returnToStart();
    }
  };

  return (
    <div className="min-h-screen main-container overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-4">
        <header className="text-center mb-4 flex-shrink-0">
          <h1 
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleReturnToStart}
            title="Click to return to start screen"
          >
            Queens Puzzle
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Place queens (👑) on the board following the rules: one per row, column, and colored region. Queens cannot touch!
          </p>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <QueensGame ref={gameRef} />
        </div>
      </div>
    </div>
  );
}