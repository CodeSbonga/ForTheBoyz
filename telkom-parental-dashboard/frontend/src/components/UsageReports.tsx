import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { UsageReportsResponse } from '../types';

interface UsageReportsProps {
  reports: UsageReportsResponse;
}

const UsageReports: React.FC<UsageReportsProps> = ({ reports }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);

  useEffect(() => {
    if (reports.charts) {
      try {
        setBarChartData(JSON.parse(reports.charts.bar_chart));
        setPieChartData(JSON.parse(reports.charts.pie_chart));
      } catch (error) {
        console.error('Error parsing chart data:', error);
      }
    }
  }, [reports]);

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Study Time (minutes)', 'Distraction Time (minutes)', 'Efficiency (%)'],
      ...reports.reports.map(report => [
        report.date,
        report.study_time_minutes,
        report.distraction_time_minutes,
        report.efficiency_percentage.toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalStudyTime = reports.reports.reduce((sum, report) => sum + report.study_time_minutes, 0);
  const totalDistractionTime = reports.reports.reduce((sum, report) => sum + report.distraction_time_minutes, 0);
  const averageEfficiency = reports.reports.reduce((sum, report) => sum + report.efficiency_percentage, 0) / reports.reports.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-2">Total Study Time</h3>
          <p className="text-3xl font-bold text-telkom-dark-blue">
            {Math.round(totalStudyTime / 60 * 10) / 10}h
          </p>
          <p className="text-sm text-gray-600">This week</p>
        </div>
        
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-2">Distraction Time</h3>
          <p className="text-3xl font-bold text-red-600">
            {Math.round(totalDistractionTime / 60 * 10) / 10}h
          </p>
          <p className="text-sm text-gray-600">This week</p>
        </div>
        
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-2">Average Efficiency</h3>
          <p className="text-3xl font-bold text-green-600">
            {averageEfficiency.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">This week</p>
        </div>
        
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-2">Study Sessions</h3>
          <p className="text-3xl font-bold text-telkom-dark-blue">
            {reports.reports.length}
          </p>
          <p className="text-sm text-gray-600">Days tracked</p>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="telkom-card">
        <h3 className="text-lg font-semibold text-telkom-blue mb-4">AI Recommendation</h3>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-telkom-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">{reports.ai_recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-4">Daily Usage Breakdown</h3>
          {barChartData ? (
            <Plot
              data={barChartData.data}
              layout={{
                ...barChartData.layout,
                width: '100%',
                height: 400,
                margin: { t: 40, r: 20, b: 40, l: 40 }
              }}
              config={{ displayModeBar: false }}
            />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="telkom-card">
          <h3 className="text-lg font-semibold text-telkom-blue mb-4">Usage Distribution</h3>
          {pieChartData ? (
            <Plot
              data={pieChartData.data}
              layout={{
                ...pieChartData.layout,
                width: '100%',
                height: 400,
                margin: { t: 40, r: 20, b: 40, l: 20 }
              }}
              config={{ displayModeBar: false }}
            />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          )}
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="telkom-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-telkom-blue">Detailed Report</h3>
          <button
            onClick={exportToCSV}
            className="telkom-button-secondary"
          >
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distraction Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.reports.map((report, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(report.study_time_minutes / 60 * 10) / 10}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(report.distraction_time_minutes / 60 * 10) / 10}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${
                      report.efficiency_percentage >= 70 ? 'text-green-600' :
                      report.efficiency_percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.efficiency_percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.efficiency_percentage >= 70 ? 'bg-green-100 text-green-800' :
                      report.efficiency_percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {report.efficiency_percentage >= 70 ? 'Excellent' :
                       report.efficiency_percentage >= 50 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsageReports;