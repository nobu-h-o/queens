'use client';

interface GameControlsProps {
  moves: number;
  timeElapsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onNewGame: () => void;
  onReset: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  isGameWon: boolean;
}

const GameControls = ({
  moves,
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {moves}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Moves</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {getDifficultyLabel(difficulty)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Board Size</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Difficulty Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGameWon && moves > 0}
            >
              <option value="easy">Easy (7×7)</option>
              <option value="medium">Medium (8×8)</option>
              <option value="hard">Hard (9×9)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onReset}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors duration-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            title="Reset current puzzle"
          >
            Reset
          </button>

          <button
            onClick={onNewGame}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Generate new puzzle"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game Rules */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Game Rules:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            One queen per row
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            One queen per column
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            One queen per colored region
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Queens cannot touch
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;