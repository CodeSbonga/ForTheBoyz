import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TelkomDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-telkom-gray">
      {/* Header */}
      <header className="bg-telkom-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold">Telkom</div>
              <div className="ml-4 text-sm opacity-90">South Africa</div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm">Welcome, {user.username}</span>
                  <button
                    onClick={logout}
                    className="bg-white text-telkom-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-telkom-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            <Link to="/" className="text-telkom-blue font-medium hover:text-telkom-dark-blue">
              Home
            </Link>
            <Link to="/" className="text-gray-600 hover:text-telkom-blue">
              My Account
            </Link>
            <Link to="/" className="text-gray-600 hover:text-telkom-blue">
              Services
            </Link>
            <Link to="/" className="text-gray-600 hover:text-telkom-blue">
              Support
            </Link>
            {user && (
              <Link
                to="/myfamily"
                className="bg-telkom-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-telkom-dark-blue transition-colors"
              >
                myFamily
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-telkom-blue to-telkom-light-blue rounded-lg text-white p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Telkom</h1>
          <p className="text-xl mb-6">Your trusted telecommunications partner in South Africa</p>
          {user ? (
            <div className="flex space-x-4">
              <Link
                to="/myfamily"
                className="bg-white text-telkom-blue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Access myFamily Dashboard
              </Link>
              {user.role === 'student' && (
                <Link
                  to="/student"
                  className="bg-telkom-light-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-telkom-dark-blue transition-colors"
                >
                  Student Portal
                </Link>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-telkom-blue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="telkom-card">
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Internet Usage</h3>
            <p className="text-3xl font-bold text-telkom-dark-blue">2.4 TB</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          <div className="telkom-card">
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Active Devices</h3>
            <p className="text-3xl font-bold text-telkom-dark-blue">12</p>
            <p className="text-sm text-gray-600">Connected</p>
          </div>
          <div className="telkom-card">
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Family Members</h3>
            <p className="text-3xl font-bold text-telkom-dark-blue">4</p>
            <p className="text-sm text-gray-600">Online</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-telkom-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Internet</h3>
            <p className="text-sm text-gray-600">High-speed broadband</p>
          </div>
          
          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-telkom-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Mobile</h3>
            <p className="text-sm text-gray-600">Cellular services</p>
          </div>
          
          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-telkom-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">TV</h3>
            <p className="text-sm text-gray-600">Digital entertainment</p>
          </div>
          
          <div className="telkom-card text-center">
            <div className="w-16 h-16 bg-telkom-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-telkom-blue mb-2">Security</h3>
            <p className="text-sm text-gray-600">Family protection</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-telkom-dark-blue text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Telkom</h3>
              <p className="text-sm opacity-90">Connecting South Africa to the world</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Internet</li>
                <li>Mobile</li>
                <li>TV</li>
                <li>Business</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Technical Support</li>
                <li>Billing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>About Us</li>
                <li>Careers</li>
                <li>News</li>
                <li>Investors</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-telkom-blue mt-8 pt-8 text-center text-sm opacity-90">
            <p>&copy; 2024 Telkom South Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TelkomDashboard;