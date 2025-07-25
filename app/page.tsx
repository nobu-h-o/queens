'use client';

import QueensGame from './components/QueensGame';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Queens Puzzle
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Place queens (👑) on the board following the rules: one per row, column, and colored region. 
            Queens cannot touch each other!
          </p>
        </header>
        <QueensGame />
      </div>
    </div>
  );
}