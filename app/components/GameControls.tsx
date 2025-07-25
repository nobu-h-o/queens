'use client';

interface GameControlsProps {
  timeElapsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onNewGame: () => void;
  onReset: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  isGameWon: boolean;
}

const GameControls = ({
  timeElapsed,
  difficulty,
  onNewGame,
  onReset,
  onDifficultyChange,
  isGameWon
}: GameControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return '7×7';
      case 'medium': return '8×8';
      case 'hard': return '9×9';
      default: return diff;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Time</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {getDifficultyLabel(difficulty)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Size</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Difficulty Selector */}
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="easy">Easy (7×7)</option>
            <option value="medium">Medium (8×8)</option>
            <option value="hard">Hard (9×9)</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={onReset}
            className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors duration-200"
            title="Reset current puzzle"
          >
            Reset
          </button>

          <button
            onClick={onNewGame}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
            title="Generate new puzzle"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game Rules */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            One per row
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            One per column
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            One per region
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            No touching
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;