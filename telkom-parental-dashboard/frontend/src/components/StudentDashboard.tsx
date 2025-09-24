import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studyModeAPI, gameScoresAPI } from '../services/api';
import { StudyMode, GameScore } from '../types';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [studyMode, setStudyMode] = useState<StudyMode>({ is_enabled: false });
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studyModeData, scoresData] = await Promise.all([
        studyModeAPI.get(),
        gameScoresAPI.get()
      ]);
      
      setStudyMode(studyModeData);
      setGameScores(scoresData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telkom-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telkom-blue mx-auto"></div>
          <p className="mt-4 text-telkom-blue">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-telkom-gray">
      {/* Header */}
      <header className="bg-telkom-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold">Telkom</Link>
              <div className="ml-4 text-sm opacity-90">Student Portal</div>
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-telkom-blue to-telkom-light-blue rounded-lg text-white p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Learning Space!</h1>
          <p className="text-lg mb-6">Ready to learn and have fun? Let's make today productive!</p>
          <div className="flex space-x-4">
            <Link
              to="/games"
              className="bg-white text-telkom-blue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Play Games
            </Link>
            <button className="bg-telkom-light-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-telkom-dark-blue transition-colors">
              Start Learning
            </button>
          </div>
        </div>

        {/* Study Mode Status */}
        <div className="telkom-card mb-8">
          <h2 className="text-xl font-semibold text-telkom-blue mb-4">Study Mode Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${studyMode.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="text-lg font-medium">
                  {studyMode.is_enabled ? 'Study Mode is Active' : 'Study Mode is Inactive'}
                </h3>
                <p className="text-sm text-gray-600">
                  {studyMode.is_enabled 
                    ? 'Focus on educational content only' 
                    : 'You can access all approved websites'
                  }
                </p>
              </div>
            </div>
            {studyMode.is_enabled && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Active Hours</div>
                <div className="font-medium">
                  {studyMode.start_time} - {studyMode.end_time}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Khan Academy</h3>
            <p className="text-sm text-gray-600 mb-4">Learn math, science, and more</p>
            <a
              href="https://khanacademy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="telkom-button text-sm"
            >
              Visit
            </a>
          </div>

          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">YouTube Learning</h3>
            <p className="text-sm text-gray-600 mb-4">Educational videos</p>
            <a
              href="https://youtube.com/education"
              target="_blank"
              rel="noopener noreferrer"
              className="telkom-button text-sm"
            >
              Visit
            </a>
          </div>

          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Duolingo</h3>
            <p className="text-sm text-gray-600 mb-4">Learn languages</p>
            <a
              href="https://duolingo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="telkom-button text-sm"
            >
              Visit
            </a>
          </div>

          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Game Zone</h3>
            <p className="text-sm text-gray-600 mb-4">Fun learning games</p>
            <Link to="/games" className="telkom-button text-sm">
              Play
            </Link>
          </div>
        </div>

        {/* Recent Game Scores */}
        {gameScores.length > 0 && (
          <div className="telkom-card">
            <h2 className="text-xl font-semibold text-telkom-blue mb-4">Your Recent Game Scores</h2>
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
            <div className="mt-4 text-center">
              <Link to="/games" className="telkom-button">
                Play More Games
              </Link>
            </div>
          </div>
        )}

        {/* Study Tips */}
        <div className="telkom-card">
          <h2 className="text-xl font-semibold text-telkom-blue mb-4">Study Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">📝 Take Notes</h3>
              <p className="text-sm text-blue-700">Write down important points while learning to remember better.</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">⏰ Take Breaks</h3>
              <p className="text-sm text-green-700">Take short breaks every 25 minutes to stay focused.</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">🎯 Set Goals</h3>
              <p className="text-sm text-purple-700">Set small daily goals to track your progress.</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-2">🤝 Ask Questions</h3>
              <p className="text-sm text-orange-700">Don't hesitate to ask for help when you need it.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;