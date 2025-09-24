import React, { useState } from 'react';
import { StudyMode } from '../types';

interface StudyModeControlProps {
  studyMode: StudyMode;
  onUpdate: (studyMode: StudyMode) => void;
}

const StudyModeControl: React.FC<StudyModeControlProps> = ({ studyMode, onUpdate }) => {
  const [isEnabled, setIsEnabled] = useState(studyMode.is_enabled);
  const [startTime, setStartTime] = useState(studyMode.start_time || '09:00');
  const [endTime, setEndTime] = useState(studyMode.end_time || '17:00');

  const handleToggle = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    await onUpdate({
      is_enabled: newEnabled,
      start_time: startTime,
      end_time: endTime
    });
  };

  const handleTimeUpdate = async () => {
    await onUpdate({
      is_enabled: isEnabled,
      start_time: startTime,
      end_time: endTime
    });
  };

  return (
    <div className="space-y-6">
      <div className="telkom-card">
        <h2 className="text-xl font-semibold text-telkom-blue mb-6">Study Mode Control</h2>
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Enable Study Mode</h3>
            <p className="text-sm text-gray-600">
              When enabled, only whitelisted educational sites will be accessible
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-telkom-blue' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Time Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="telkom-input"
            />
          </div>
          
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="telkom-input"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleTimeUpdate}
            className="telkom-button"
          >
            Update Schedule
          </button>
        </div>
      </div>

      {/* Status Information */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">Current Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Study Mode:</span>
            <span className={`font-medium ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {isEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Hours:</span>
            <span className="font-medium">{startTime} - {endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Time:</span>
            <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Educational Sites Preview */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">Educational Sites</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">Khan Academy</div>
            <div className="text-sm text-green-600">khanacademy.org</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">YouTube Learning</div>
            <div className="text-sm text-green-600">youtube.com/education</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">Coursera</div>
            <div className="text-sm text-green-600">coursera.org</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">Duolingo</div>
            <div className="text-sm text-green-600">duolingo.com</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">Wikipedia</div>
            <div className="text-sm text-green-600">wikipedia.org</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800">Google Scholar</div>
            <div className="text-sm text-green-600">scholar.google.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyModeControl;