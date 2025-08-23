import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Shield, Mail, Calendar, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function QuickActions() {
  const { toast } = useToast();

  const pauseInternetMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/quick-actions/pause-internet');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Internet Paused",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pause internet. Please try again.",
        variant: "destructive",
      });
    }
  });

  const emergencyUnblockMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/quick-actions/emergency-unblock');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Emergency Unblock Activated",
        description: data.message,
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to activate emergency unblock. Please try again.",
        variant: "destructive",
      });
    }
  });

  const weeklyReportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/quick-actions/weekly-report');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Weekly Report Sent",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send weekly report. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleScheduleDowntime = () => {
    toast({
      title: "Schedule Downtime",
      description: "Downtime scheduling feature will be available soon.",
    });
  };

  return (
    <Card className="bg-white border-2 border-telkom-500 shadow-lg">
      <CardHeader className="border-b-2 border-telkom-500 bg-telkom-50">
        <CardTitle className="text-xl font-bold text-telkom-600 flex items-center gap-2">
          <Zap className="w-6 h-6 text-telkom-500" />
          Quick Actions
        </CardTitle>
        <p className="text-base text-telkom-500">
          Common parental control tasks
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            onClick={() => pauseInternetMutation.mutate()}
            disabled={pauseInternetMutation.isPending}
            data-testid="button-pause-internet"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <Pause className="w-4 h-4 mr-2" />
            {pauseInternetMutation.isPending ? 'Pausing...' : 'Pause Internet for All'}
          </Button>
          
          <Button
            onClick={() => emergencyUnblockMutation.mutate()}
            disabled={emergencyUnblockMutation.isPending}
            data-testid="button-emergency-unblock"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            {emergencyUnblockMutation.isPending ? 'Activating...' : 'Emergency Unblock (30 min)'}
          </Button>
          
          <Button
            onClick={() => weeklyReportMutation.mutate()}
            disabled={weeklyReportMutation.isPending}
            data-testid="button-weekly-report"
            className="w-full bg-telkom-500 hover:bg-telkom-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            {weeklyReportMutation.isPending ? 'Sending...' : 'Send Weekly Report'}
          </Button>
          
          <Button
            onClick={handleScheduleDowntime}
            data-testid="button-schedule-downtime"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Downtime
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-lg font-semibold text-telkom-500">4</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Devices</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">12</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rules Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
