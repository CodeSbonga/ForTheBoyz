import React, { useState } from 'react';
import { StudyRule } from '../types';

interface WhitelistManagementProps {
  rules: StudyRule[];
  onAdd: (rule: Omit<StudyRule, 'id'>) => void;
  onDelete: (id: number) => void;
}

const WhitelistManagement: React.FC<WhitelistManagementProps> = ({ rules, onAdd, onDelete }) => {
  const [newDomain, setNewDomain] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [ruleType, setRuleType] = useState<'whitelist' | 'blacklist'>('whitelist');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      await onAdd({
        rule_type: ruleType,
        domain: newDomain.trim(),
        app_name: newAppName.trim() || undefined
      });
      setNewDomain('');
      setNewAppName('');
      setShowAddForm(false);
    }
  };

  const whitelistRules = rules.filter(rule => rule.rule_type === 'whitelist');
  const blacklistRules = rules.filter(rule => rule.rule_type === 'blacklist');

  return (
    <div className="space-y-6">
      {/* Add New Rule */}
      <div className="telkom-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-telkom-blue">Manage Rules</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="telkom-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Rule'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAdd} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="rule-type" className="block text-sm font-medium text-gray-700 mb-2">
                Rule Type
              </label>
              <select
                id="rule-type"
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as 'whitelist' | 'blacklist')}
                className="telkom-input"
              >
                <option value="whitelist">Whitelist (Allow)</option>
                <option value="blacklist">Blacklist (Block)</option>
              </select>
            </div>

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain/URL
              </label>
              <input
                id="domain"
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g., khanacademy.org or youtube.com"
                className="telkom-input"
                required
              />
            </div>

            <div>
              <label htmlFor="app-name" className="block text-sm font-medium text-gray-700 mb-2">
                App Name (Optional)
              </label>
              <input
                id="app-name"
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="e.g., Khan Academy, YouTube"
                className="telkom-input"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="telkom-button">
                Add Rule
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="telkom-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Whitelist Rules */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">
          Whitelisted Sites ({whitelistRules.length})
        </h3>
        {whitelistRules.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No whitelisted sites yet. Add some educational sites to get started.</p>
        ) : (
          <div className="space-y-3">
            {whitelistRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">
                    {rule.app_name || rule.domain}
                  </div>
                  <div className="text-sm text-green-600">{rule.domain}</div>
                </div>
                <button
                  onClick={() => onDelete(rule.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blacklist Rules */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">
          Blocked Apps ({blacklistRules.length})
        </h3>
        {blacklistRules.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No blocked apps yet. Add entertainment apps to block during study time.</p>
        ) : (
          <div className="space-y-3">
            {blacklistRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <div className="font-medium text-red-800">
                    {rule.app_name || rule.domain}
                  </div>
                  <div className="text-sm text-red-600">{rule.domain}</div>
                </div>
                <button
                  onClick={() => onDelete(rule.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Suggestions */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">Quick Add Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Educational Sites</h4>
            <div className="space-y-2">
              {[
                { name: 'Khan Academy', domain: 'khanacademy.org' },
                { name: 'Coursera', domain: 'coursera.org' },
                { name: 'Duolingo', domain: 'duolingo.com' },
                { name: 'Wikipedia', domain: 'wikipedia.org' }
              ].map((site) => (
                <button
                  key={site.domain}
                  onClick={() => {
                    setRuleType('whitelist');
                    setNewDomain(site.domain);
                    setNewAppName(site.name);
                    setShowAddForm(true);
                  }}
                  className="w-full text-left p-2 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                >
                  <div className="font-medium text-green-800">{site.name}</div>
                  <div className="text-sm text-green-600">{site.domain}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-red-700 mb-2">Entertainment Apps</h4>
            <div className="space-y-2">
              {[
                { name: 'TikTok', domain: 'tiktok.com' },
                { name: 'Instagram', domain: 'instagram.com' },
                { name: 'Facebook', domain: 'facebook.com' },
                { name: 'Netflix', domain: 'netflix.com' }
              ].map((app) => (
                <button
                  key={app.domain}
                  onClick={() => {
                    setRuleType('blacklist');
                    setNewDomain(app.domain);
                    setNewAppName(app.name);
                    setShowAddForm(true);
                  }}
                  className="w-full text-left p-2 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                >
                  <div className="font-medium text-red-800">{app.name}</div>
                  <div className="text-sm text-red-600">{app.domain}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitelistManagement;