import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, Ban } from 'lucide-react';
import type { BlockedApp } from '@shared/schema';

export function BlockedApps() {
  const { data: blockedApps = [], isLoading } = useQuery<BlockedApp[]>({
    queryKey: ['/api/blocked-apps'],
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Social Media': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Video Platform': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Gaming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-telkom-500 shadow-lg">
      <CardHeader className="border-b-2 border-telkom-500 bg-telkom-50">
        <CardTitle className="text-xl font-bold text-telkom-600 flex items-center gap-2">
          <Ban className="w-6 h-6 text-telkom-500" />
          Blocked Entertainment Apps
        </CardTitle>
        <p className="text-base text-telkom-500">
          Currently restricted applications
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          {blockedApps.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              data-testid={`blocked-app-${app.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getCategoryColor(app.category)} data-testid={`category-${app.id}`}>
                      {app.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <Badge 
                className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" 
                data-testid={`status-${app.id}`}
              >
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>
            </div>
          ))}
          
          {blockedApps.length === 0 && (
            <div className="text-center py-8">
              <Ban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No apps are currently blocked.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Blocked apps will appear here when study mode is active.</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {blockedApps.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{blockedApps.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocked</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Set(blockedApps.map(app => app.category)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
