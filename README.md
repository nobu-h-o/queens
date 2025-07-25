# Queens
This is a LinkedIn Queens clone that is made 100% by Claude Code. Below is the prompt that created this project, also made by Claude.

# LinkedIn Queens Game - Web App Implementation Prompt

Please create a complete web application that implements the LinkedIn Queens puzzle game. Here are the detailed requirements:

## Game Overview
Create a logic puzzle game where players place queens (👑) on a colored grid following specific rules. This should be a polished, responsive web application with smooth interactions and visual feedback.

## Core Game Rules
1. **One queen per row** - Each horizontal row must contain exactly one queen
2. **One queen per column** - Each vertical column must contain exactly one queen  
3. **One queen per colored region** - Each distinctly colored area must contain exactly one queen
4. **No adjacent queens** - Queens cannot touch each other horizontally, vertically, or diagonally
5. **Logical deduction** - Puzzles should be solvable through logic without guessing

## User Interface Requirements

### Game Board
- Create a responsive grid (start with 7x7, support up to 10x10)
- Generate distinct colored regions (minimum 5-7 different colors)
- Clear visual distinction between different colored regions
- Cells should be large enough for touch interaction (mobile-friendly)
- Professional, modern styling with smooth animations

### Interaction System
- **Single click**: Place/remove an X marker (indicating queen cannot be placed)
- **Double click or dedicated button**: Place/remove a queen (👑)
- **Drag support**: Allow dragging to mark multiple cells with X
- **Visual feedback**: Hover effects and selection indicators
- **Error indication**: Highlight conflicts when rules are violated

### Game Controls
- **New Game button**: Generate a new puzzle
- **Reset button**: Clear current puzzle back to starting state
- **Hint system**: Show possible moves or highlight errors
- **Difficulty selector**: Easy (7x7), Medium (8x8), Hard (9x9+)
- **Timer**: Track solving time
- **Move counter**: Track number of moves made

## Technical Implementation

### Puzzle Generation
- Create algorithm to generate valid puzzles with unique solutions
- Ensure puzzles are solvable through logical deduction
- Pre-place some queens as starting hints (1-3 queens typically)
- Generate colored regions that create interesting constraints

### Validation System
- Real-time constraint checking
- Visual indicators for rule violations
- Win condition detection
- Prevent invalid moves when possible

### Responsive Design
- Mobile-first responsive design
- Touch-friendly interactions
- Clean, modern UI inspired by LinkedIn's design
- Dark/light theme support
- Accessibility considerations (ARIA labels, keyboard navigation)

## Advanced Features (if possible)
- **Puzzle library**: Multiple pre-designed puzzles of varying difficulty
- **Solution verification**: Check if current state can lead to valid solution
- **Step-by-step hints**: Guide players through logical deduction
- **Statistics tracking**: Solve times, accuracy, difficulty progress
- **Animation effects**: Smooth transitions for piece placement
- **Sound effects**: Optional audio feedback for actions

## Code Structure
- Use modern JavaScript (ES6+) with modular architecture
- Implement clean separation between game logic and UI
- Include comprehensive error handling
- Write readable, well-commented code
- Use CSS Grid or Flexbox for responsive layout
- Consider using a small framework like React if beneficial

## Visual Design Guidelines
- Clean, professional aesthetic similar to LinkedIn's games
- Intuitive color scheme for regions (avoid colors that are hard to distinguish)
- Smooth animations and transitions
- Clear visual hierarchy
- Professional typography
- Consistent spacing and alignment

## Testing & Quality
- Ensure puzzles are always solvable
- Test across different screen sizes
- Validate all game rules are properly enforced
- Smooth performance on both desktop and mobile
- Handle edge cases gracefully

## Deliverables
Please provide a complete, working web application that can be opened in a browser and played immediately. Include all HTML, CSS, and JavaScript in organized files with clear documentation of how the game works and how to extend it.

The goal is to create a professional-quality implementation that captures the engaging puzzle mechanics of LinkedIn's Queens game while providing an excellent user experience.
