import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gameScoresAPI } from '../services/api';
import { GameScore } from '../types';

const GameZone: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    loadGameScores();
  }, []);

  const loadGameScores = async () => {
    try {
      const scores = await gameScoresAPI.get();
      setGameScores(scores);
    } catch (error) {
      console.error('Error loading game scores:', error);
    }
  };

  const saveScore = async (gameType: string, score: number, level: number) => {
    try {
      await gameScoresAPI.create({
        game_type: gameType,
        score: score,
        level: level
      });
      loadGameScores();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const PuzzleGame: React.FC = () => {
    const [puzzle, setPuzzle] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      initializePuzzle();
    }, []);

    const initializePuzzle = () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents empty space
      const shuffled = [...numbers].sort(() => Math.random() - 0.5);
      setPuzzle(shuffled);
      setMoves(0);
      setIsComplete(false);
    };

    const moveTile = (index: number) => {
      if (isComplete) return;
      
      const emptyIndex = puzzle.indexOf(0);
      const adjacent = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3];
      
      if (adjacent.includes(index)) {
        const newPuzzle = [...puzzle];
        [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
        setPuzzle(newPuzzle);
        setMoves(moves + 1);
        
        // Check if puzzle is complete
        const isSolved = newPuzzle.slice(0, 8).every((num, i) => num === i + 1);
        if (isSolved) {
          setIsComplete(true);
          const score = Math.max(0, 1000 - moves * 10);
          setCurrentScore(score);
          saveScore('puzzle', score, currentLevel);
        }
      }
    };

    return (
      <div className="telkom-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-telkom-blue">Number Puzzle</h2>
          <div className="text-sm text-gray-600">Moves: {moves}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 w-48 mx-auto mb-4">
          {puzzle.map((num, index) => (
            <button
              key={index}
              onClick={() => moveTile(index)}
              className={`w-12 h-12 rounded-lg font-bold text-lg ${
                num === 0 
                  ? 'bg-gray-200' 
                  : 'bg-telkom-blue text-white hover:bg-telkom-dark-blue'
              }`}
              disabled={num === 0}
            >
              {num === 0 ? '' : num}
            </button>
          ))}
        </div>
        
        {isComplete && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</div>
            <div className="text-lg text-telkom-blue mb-4">Score: {currentScore}</div>
            <button
              onClick={initializePuzzle}
              className="telkom-button"
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="text-center mt-4">
          <button
            onClick={initializePuzzle}
            className="telkom-button-secondary"
          >
            New Puzzle
          </button>
        </div>
      </div>
    );
  };

  const SnakeLadderGame: React.FC = () => {
    const [position, setPosition] = useState(1);
    const [dice, setDice] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const snakesAndLadders: { [key: number]: number } = {
      3: 22, 5: 8, 11: 26, 17: 4, 19: 7, 20: 29, 21: 9, 27: 1
    };

    const rollDice = () => {
      if (isRolling || gameOver) return;
      
      setIsRolling(true);
      setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        setDice(roll);
        
        let newPosition = position + roll;
        
        // Check for snakes and ladders
        if (snakesAndLadders[newPosition]) {
          newPosition = snakesAndLadders[newPosition];
        }
        
        // Check if won
        if (newPosition >= 30) {
          newPosition = 30;
          setGameOver(true);
          const score = Math.max(0, 1000 - (position - 1) * 10);
          setCurrentScore(score);
          saveScore('snake_ladder', score, currentLevel);
        }
        
        setPosition(newPosition);
        setIsRolling(false);
      }, 1000);
    };

    const resetGame = () => {
      setPosition(1);
      setDice(0);
      setGameOver(false);
    };

    return (
      <div className="telkom-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-telkom-blue">Snakes & Ladders</h2>
          <div className="text-sm text-gray-600">Position: {position}/30</div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-telkom-blue mb-2">
            {dice > 0 ? dice : '?'}
          </div>
          <button
            onClick={rollDice}
            disabled={isRolling || gameOver}
            className={`telkom-button ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>
        
        {gameOver && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">🏆 You Won!</div>
            <div className="text-lg text-telkom-blue mb-4">Score: {currentScore}</div>
            <button
              onClick={resetGame}
              className="telkom-button"
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="text-center mt-4">
          <button
            onClick={resetGame}
            className="telkom-button-secondary"
          >
            Reset Game
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-telkom-gray">
      {/* Header */}
      <header className="bg-telkom-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/student" className="text-2xl font-bold">Telkom</Link>
              <div className="ml-4 text-sm opacity-90">Game Zone</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Hi, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-white text-telkom-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeGame ? (
          <div className="space-y-6">
            {/* Game Selection */}
            <div className="telkom-card">
              <h1 className="text-3xl font-bold text-telkom-blue mb-6 text-center">🎮 Game Zone</h1>
              <p className="text-center text-gray-600 mb-8">Choose a game to play and have fun while learning!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 border-2 border-telkom-blue rounded-lg hover:bg-telkom-blue hover:text-white transition-colors cursor-pointer"
                     onClick={() => setActiveGame('puzzle')}>
                  <div className="text-4xl mb-4">🧩</div>
                  <h3 className="text-xl font-semibold mb-2">Number Puzzle</h3>
                  <p className="text-sm">Arrange numbers 1-8 in order. Challenge your logic skills!</p>
                </div>
                
                <div className="text-center p-6 border-2 border-telkom-blue rounded-lg hover:bg-telkom-blue hover:text-white transition-colors cursor-pointer"
                     onClick={() => setActiveGame('snake_ladder')}>
                  <div className="text-4xl mb-4">🐍</div>
                  <h3 className="text-xl font-semibold mb-2">Snakes & Ladders</h3>
                  <p className="text-sm">Roll the dice and reach the finish line. Watch out for snakes!</p>
                </div>
              </div>
            </div>

            {/* High Scores */}
            {gameScores.length > 0 && (
              <div className="telkom-card">
                <h2 className="text-xl font-semibold text-telkom-blue mb-4">Your High Scores</h2>
                <div className="space-y-3">
                  {gameScores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium capitalize">{score.game_type.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-600">Level {score.level}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-telkom-blue">{score.score} points</div>
                        <div className="text-sm text-gray-600">{new Date(score.played_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveGame(null)}
                className="telkom-button-secondary"
              >
                ← Back to Games
              </button>
              <div className="text-sm text-gray-600">
                Current Score: {currentScore} | Level: {currentLevel}
              </div>
            </div>
            
            {activeGame === 'puzzle' && <PuzzleGame />}
            {activeGame === 'snake_ladder' && <SnakeLadderGame />}
          </div>
        )}
      </main>
    </div>
  );
};

export default GameZone;