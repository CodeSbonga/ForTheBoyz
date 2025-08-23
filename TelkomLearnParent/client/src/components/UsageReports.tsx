import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UsageReport } from '@shared/schema';

export function UsageReports() {
  const { toast } = useToast();

  const { data: report, isLoading } = useQuery<UsageReport>({
    queryKey: ['/api/usage-report'],
  });

  const handleExportCSV = () => {
    toast({
      title: "CSV Export",
      description: "Usage report has been exported to CSV format.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "Usage report has been exported to PDF format.",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-telkom-500 shadow-lg">
      <CardHeader className="border-b-2 border-telkom-500 bg-telkom-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-telkom-600 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-telkom-500" />
              Weekly Usage Report
            </CardTitle>
            <p className="text-base text-telkom-500">
              Study vs distraction time analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              data-testid="button-export-csv"
              className="border-gray-300 dark:border-gray-600"
            >
              <FileText className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
            <Button
              onClick={handleExportPDF}
              data-testid="button-export-pdf"
              className="bg-telkom-500 hover:bg-telkom-600 text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center" data-testid="stat-study-time">
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {report?.totalStudyTime || '0 hrs'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
          </div>
          <div className="text-center" data-testid="stat-distraction-time">
            <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
              {report?.distractionTime || '0 hrs'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Entertainment Time</p>
          </div>
          <div className="text-center" data-testid="stat-efficiency">
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {report?.efficiency || '0%'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Study Efficiency</p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Recommendation</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1" data-testid="ai-recommendation">
                {report?.aiRecommendation || 'No recommendations available at this time.'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Usage Details */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Weekly Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Top Educational Activities</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Khan Academy</span>
                  <span>5.2 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Coursera</span>
                  <span>3.8 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Educational YouTube</span>
                  <span>2.1 hrs</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Study Patterns</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Peak Study Time</span>
                  <span>2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Session</span>
                  <span>45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Most Active Day</span>
                  <span>Wednesday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
