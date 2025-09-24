import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studyModeAPI, rulesAPI, usageReportsAPI } from '../services/api';
import { StudyMode, StudyRule, UsageReportsResponse } from '../types';
import StudyModeControl from './StudyModeControl';
import WhitelistManagement from './WhitelistManagement';
import UsageReports from './UsageReports';

const ParentalDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [studyMode, setStudyMode] = useState<StudyMode>({ is_enabled: false });
  const [rules, setRules] = useState<StudyRule[]>([]);
  const [usageReports, setUsageReports] = useState<UsageReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studyModeData, rulesData, reportsData] = await Promise.all([
        studyModeAPI.get(),
        rulesAPI.get(),
        usageReportsAPI.get(7)
      ]);
      
      setStudyMode(studyModeData);
      setRules(rulesData);
      setUsageReports(reportsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudyModeUpdate = async (updatedMode: StudyMode) => {
    try {
      await studyModeAPI.update(updatedMode);
      setStudyMode(updatedMode);
    } catch (error) {
      console.error('Error updating study mode:', error);
    }
  };

  const handleRuleAdd = async (rule: Omit<StudyRule, 'id'>) => {
    try {
      await rulesAPI.create(rule);
      loadData(); // Reload rules
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const handleRuleDelete = async (id: number) => {
    try {
      await rulesAPI.delete(id);
      loadData(); // Reload rules
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telkom-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telkom-blue mx-auto"></div>
          <p className="mt-4 text-telkom-blue">Loading dashboard...</p>
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
              <div className="ml-4 text-sm opacity-90">myFamily Dashboard</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.username}</span>
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

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-telkom-blue text-telkom-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('study-mode')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'study-mode'
                  ? 'border-telkom-blue text-telkom-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Study Mode
            </button>
            <button
              onClick={() => setActiveTab('whitelist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'whitelist'
                  ? 'border-telkom-blue text-telkom-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Whitelist
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-telkom-blue text-telkom-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="telkom-card">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${studyMode.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h3 className="text-lg font-semibold text-telkom-blue">Study Mode</h3>
                    <p className="text-sm text-gray-600">
                      {studyMode.is_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="telkom-card">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-telkom-blue"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-telkom-blue">Whitelisted Sites</h3>
                    <p className="text-sm text-gray-600">{rules.filter(r => r.rule_type === 'whitelist').length} sites</p>
                  </div>
                </div>
              </div>
              
              <div className="telkom-card">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-orange-500"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-telkom-blue">Blocked Apps</h3>
                    <p className="text-sm text-gray-600">{rules.filter(r => r.rule_type === 'blacklist').length} apps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="telkom-card">
              <h2 className="text-xl font-semibold text-telkom-blue mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('study-mode')}
                  className="p-4 border-2 border-telkom-blue rounded-lg text-center hover:bg-telkom-blue hover:text-white transition-colors"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-medium">Study Mode</div>
                </button>
                
                <button
                  onClick={() => setActiveTab('whitelist')}
                  className="p-4 border-2 border-telkom-blue rounded-lg text-center hover:bg-telkom-blue hover:text-white transition-colors"
                >
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-medium">Manage Sites</div>
                </button>
                
                <button
                  onClick={() => setActiveTab('reports')}
                  className="p-4 border-2 border-telkom-blue rounded-lg text-center hover:bg-telkom-blue hover:text-white transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">View Reports</div>
                </button>
                
                <Link
                  to="/student"
                  className="p-4 border-2 border-telkom-blue rounded-lg text-center hover:bg-telkom-blue hover:text-white transition-colors"
                >
                  <div className="text-2xl mb-2">👨‍🎓</div>
                  <div className="font-medium">Student View</div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            {usageReports && (
              <div className="telkom-card">
                <h2 className="text-xl font-semibold text-telkom-blue mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {usageReports.reports.slice(0, 3).map((report, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{report.date}</div>
                        <div className="text-sm text-gray-600">
                          {report.study_time_minutes}min study, {report.distraction_time_minutes}min distraction
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-telkom-blue">{report.efficiency_percentage.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">efficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'study-mode' && (
          <StudyModeControl
            studyMode={studyMode}
            onUpdate={handleStudyModeUpdate}
          />
        )}

        {activeTab === 'whitelist' && (
          <WhitelistManagement
            rules={rules}
            onAdd={handleRuleAdd}
            onDelete={handleRuleDelete}
          />
        )}

        {activeTab === 'reports' && usageReports && (
          <UsageReports reports={usageReports} />
        )}
      </main>
    </div>
  );
};

export default ParentalDashboard;