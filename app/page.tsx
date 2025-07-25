'use client';

import QueensGame from './components/QueensGame';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-4">
        <header className="text-center mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Queens Puzzle
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Place queens (👑) on the board following the rules: one per row, column, and colored region. Queens cannot touch!
          </p>
        </header>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <QueensGame />
        </div>
      </div>
    </div>
  );
}