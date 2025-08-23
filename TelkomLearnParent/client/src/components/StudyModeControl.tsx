import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Settings } from '@shared/schema';

export function StudyModeControl() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const response = await apiRequest('PUT', '/api/settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings Updated",
        description: "Study mode settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggleStudyMode = (enabled: boolean) => {
    updateSettingsMutation.mutate({ studyModeEnabled: enabled });
  };

  const handleScheduleChange = (field: string, value: string) => {
    updateSettingsMutation.mutate({ [field]: value });
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
              <BookOpen className="w-6 h-6 text-telkom-500" />
              Study Mode Controls
            </CardTitle>
            <p className="text-base text-telkom-500">
              Manage household internet access and restrictions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-base font-semibold text-telkom-600">Study Mode</span>
            <Switch
              checked={settings?.studyModeEnabled || false}
              onCheckedChange={handleToggleStudyMode}
              data-testid="toggle-study-mode"
              className="data-[state=checked]:bg-telkom-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-telkom-600 mb-4">Study Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-telkom-500">Weekdays</label>
                <Select
                  value={settings?.weekdayHours || ''}
                  onValueChange={(value) => handleScheduleChange('weekdayHours', value)}
                  data-testid="select-weekday-hours"
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6:00 AM - 9:00 PM">6:00 AM - 9:00 PM</SelectItem>
                    <SelectItem value="7:00 AM - 10:00 PM">7:00 AM - 10:00 PM</SelectItem>
                    <SelectItem value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-telkom-500">Weekends</label>
                <Select
                  value={settings?.weekendHours || ''}
                  onValueChange={(value) => handleScheduleChange('weekendHours', value)}
                  data-testid="select-weekend-hours"
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</SelectItem>
                    <SelectItem value="9:00 AM - 9:00 PM">9:00 AM - 9:00 PM</SelectItem>
                    <SelectItem value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-telkom-600 mb-4">Break Times</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-telkom-500">Lunch Break</label>
                <span className="text-base font-semibold text-telkom-600">{settings?.lunchBreak}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-telkom-500">Dinner Break</label>
                <span className="text-base font-semibold text-telkom-600">{settings?.dinnerBreak}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
