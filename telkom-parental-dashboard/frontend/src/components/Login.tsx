import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(username, password);
        if (success) {
          navigate('/');
        } else {
          setError('Invalid username or password');
        }
      } else {
        success = await register(username, email, password, role);
        if (success) {
          setError('');
          setIsLogin(true);
          setUsername('');
          setEmail('');
          setPassword('');
        } else {
          setError('Registration failed. Username or email may already exist.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-telkom-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-telkom-blue rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-telkom-dark-blue">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
              }}
              className="font-medium text-telkom-blue hover:text-telkom-dark-blue"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="telkom-card">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="telkom-input"
                  placeholder="Enter your username"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="telkom-input"
                    placeholder="Enter your email"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="telkom-input"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="telkom-input"
                  >
                    <option value="parent">Parent</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full telkom-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-3">Demo Credentials</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Parent:</strong> username: parent, password: parent123
            </div>
            <div>
              <strong>Student:</strong> username: student, password: student123
            </div>
            <div>
              <strong>Admin:</strong> username: admin, password: admin123
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-telkom-blue hover:text-telkom-dark-blue font-medium"
          >
            ← Back to Telkom Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;