export type CellState = 'empty' | 'queen' | 'blocked';

export interface Cell {
  state: CellState;
  region: number;
  isHint: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Region {
  id: number;
  cells: Position[];
  color: string;
}

export interface GameState {
  board: Cell[][];
  size: number;
  regions: Region[];
  solution: Position[];
}

// Generate colored regions using a flood-fill approach
function generateRegions(size: number): { regions: Region[], regionMap: number[][] } {
  const regionMap: number[][] = Array(size).fill(null).map(() => Array(size).fill(-1));
  const regions: Region[] = [];
  let regionId = 0;

  // Create random seed points for regions
  const numRegions = Math.max(5, Math.min(10, size)); // 5-10 regions depending on board size
  const seedPoints: Position[] = [];
  
  // Generate seed points
  for (let i = 0; i < numRegions; i++) {
    let attempts = 0;
    let row, col;
    do {
      row = Math.floor(Math.random() * size);
      col = Math.floor(Math.random() * size);
      attempts++;
    } while (regionMap[row][col] !== -1 && attempts < 100);
    
    if (regionMap[row][col] === -1) {
      seedPoints.push({ row, col });
      regionMap[row][col] = regionId;
      regions.push({
        id: regionId,
        cells: [{ row, col }],
        color: `region-${regionId}`
      });
      regionId++;
    }
  }

  // Grow regions using a queue-based approach
  const queue: Array<{ pos: Position, regionId: number }> = [];
  seedPoints.forEach((pos, idx) => {
    if (idx < regions.length) {
      queue.push({ pos, regionId: idx });
    }
  });

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  while (queue.length > 0) {
    const { pos, regionId: currentRegion } = queue.shift()!;
    
    for (const [dr, dc] of directions) {
      const newRow = pos.row + dr;
      const newCol = pos.col + dc;
      
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && 
          regionMap[newRow][newCol] === -1) {
        
        // Add some randomness to region growth
        if (Math.random() < 0.7) {
          regionMap[newRow][newCol] = currentRegion;
          regions[currentRegion].cells.push({ row: newRow, col: newCol });
          queue.push({ pos: { row: newRow, col: newCol }, regionId: currentRegion });
        }
      }
    }
  }

  // Fill any remaining empty cells with the nearest region
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (regionMap[row][col] === -1) {
        let minDistance = Infinity;
        let nearestRegion = 0;
        
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (regionMap[r][c] !== -1) {
              const distance = Math.abs(row - r) + Math.abs(col - c);
              if (distance < minDistance) {
                minDistance = distance;
                nearestRegion = regionMap[r][c];
              }
            }
          }
        }
        
        regionMap[row][col] = nearestRegion;
        regions[nearestRegion].cells.push({ row, col });
      }
    }
  }

  return { regions, regionMap };
}

// Generate a valid solution using backtracking
function generateSolution(size: number, regionMap: number[][]): Position[] | null {
  const solution: Position[] = [];
  const usedCols = new Set<number>();
  const usedRegions = new Set<number>();

  function isValidPlacement(row: number, col: number): boolean {
    // Check column constraint
    if (usedCols.has(col)) return false;
    
    // Check region constraint
    const region = regionMap[row][col];
    if (usedRegions.has(region)) return false;
    
    // Check diagonal and adjacent constraints
    for (const queenPos of solution) {
      const rowDiff = Math.abs(row - queenPos.row);
      const colDiff = Math.abs(col - queenPos.col);
      
      // Check diagonal attack
      if (rowDiff === colDiff) return false;
      
      // Check adjacent cells (queens cannot touch)
      if (rowDiff <= 1 && colDiff <= 1) return false;
    }
    
    return true;
  }

  function backtrack(row: number): boolean {
    if (row === size) return true;
    
    // Try all columns in this row
    const columns = Array.from({ length: size }, (_, i) => i);
    // Shuffle for randomness
    for (let i = columns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [columns[i], columns[j]] = [columns[j], columns[i]];
    }
    
    for (const col of columns) {
      if (isValidPlacement(row, col)) {
        solution.push({ row, col });
        usedCols.add(col);
        usedRegions.add(regionMap[row][col]);
        
        if (backtrack(row + 1)) return true;
        
        // Backtrack
        solution.pop();
        usedCols.delete(col);
        usedRegions.delete(regionMap[row][col]);
      }
    }
    
    return false;
  }

  if (backtrack(0)) {
    return solution;
  }
  
  return null;
}

// Generate a complete puzzle
export function generatePuzzle(size: number): GameState {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      const { regions, regionMap } = generateRegions(size);
      const solution = generateSolution(size, regionMap);
      
      if (solution && solution.length === size) {
        // Create the board
        const board: Cell[][] = Array(size).fill(null).map((_, row) =>
          Array(size).fill(null).map((_, col) => ({
            state: 'empty' as CellState,
            region: regionMap[row][col],
            isHint: false
          }))
        );
        
        // Place 1-2 queens as hints
        const numHints = Math.min(2, Math.floor(size / 4));
        const hintIndices = [];
        for (let i = 0; i < numHints; i++) {
          let hintIndex;
          do {
            hintIndex = Math.floor(Math.random() * solution.length);
          } while (hintIndices.includes(hintIndex));
          hintIndices.push(hintIndex);
          
          const hintPos = solution[hintIndex];
          board[hintPos.row][hintPos.col].state = 'queen';
          board[hintPos.row][hintPos.col].isHint = true;
        }
        
        return {
          board,
          size,
          regions,
          solution
        };
      }
    } catch (error) {
      console.warn('Failed to generate puzzle, retrying...', error);
    }
    
    attempts++;
  }
  
  // Fallback: create a simple puzzle if generation fails
  return createFallbackPuzzle(size);
}

// Create a simple fallback puzzle
function createFallbackPuzzle(size: number): GameState {
  const regions: Region[] = [];
  const regionMap: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  
  // Create simple rectangular regions
  const regionSize = Math.ceil(size / 3);
  let regionId = 0;
  
  for (let startRow = 0; startRow < size; startRow += regionSize) {
    for (let startCol = 0; startCol < size; startCol += regionSize) {
      const cells: Position[] = [];
      
      for (let r = startRow; r < Math.min(startRow + regionSize, size); r++) {
        for (let c = startCol; c < Math.min(startCol + regionSize, size); c++) {
          regionMap[r][c] = regionId;
          cells.push({ row: r, col: c });
        }
      }
      
      regions.push({
        id: regionId,
        cells,
        color: `region-${regionId}`
      });
      regionId++;
    }
  }
  
  // Create board
  const board: Cell[][] = Array(size).fill(null).map((_, row) =>
    Array(size).fill(null).map((_, col) => ({
      state: 'empty' as CellState,
      region: regionMap[row][col],
      isHint: false
    }))
  );
  
  // Place one hint queen
  board[0][0].state = 'queen';
  board[0][0].isHint = true;
  
  return {
    board,
    size,
    regions,
    solution: [{ row: 0, col: 0 }] // Simplified solution
  };
}

// Utility functions for game validation
export function isValidQueenPlacement(
  board: Cell[][], 
  row: number, 
  col: number, 
  size: number
): boolean {
  const cell = board[row][col];
  
  // Check row
  for (let c = 0; c < size; c++) {
    if (c !== col && board[row][c].state === 'queen') return false;
  }
  
  // Check column
  for (let r = 0; r < size; r++) {
    if (r !== row && board[r][col].state === 'queen') return false;
  }
  
  // Check diagonals
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < size && c >= 0 && c < size) {
      if (board[r][c].state === 'queen') return false;
      r += dr;
      c += dc;
    }
  }
  
  // Check adjacent cells
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].state === 'queen') {
        return false;
      }
    }
  }
  
  // Check region
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r !== row || c !== col) && 
          board[r][c].region === cell.region && 
          board[r][c].state === 'queen') {
        return false;
      }
    }
  }
  
  return true;
}