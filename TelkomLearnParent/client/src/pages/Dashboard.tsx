import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, Clock, Ban } from 'lucide-react';
import { StudyModeControl } from '@/components/StudyModeControl';
import { FamilyMembers } from '@/components/FamilyMembers';
import { WhitelistManagement } from '@/components/WhitelistManagement';
import { UsageReports } from '@/components/UsageReports';
import { BlockedApps } from '@/components/BlockedApps';
import { QuickActions } from '@/components/QuickActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { FamilyMember, Settings, UsageReport, BlockedApp } from '@shared/schema';

export default function Dashboard() {
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const { data: report } = useQuery<UsageReport>({
    queryKey: ['/api/usage-report'],
  });

  const { data: blockedApps = [] } = useQuery<BlockedApp[]>({
    queryKey: ['/api/blocked-apps'],
  });

  const stats = {
    familyMembers: familyMembers.length,
    studyMode: settings?.studyModeEnabled ? 'Active' : 'Inactive',
    studyTime: report?.totalStudyTime || '0 hrs',
    blockedApps: blockedApps.length
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-telkom-500 shadow-lg border-b-4 border-white">
        <div className="px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-telkom-500 font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Telkom Family Dashboard
                </h1>
                <p className="text-base text-blue-100">
                  Parental Controls & Usage Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <div className="text-right">
                <p className="text-lg font-semibold text-white">Sarah Johnson</p>
                <p className="text-sm text-blue-100">Admin Parent</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-telkom-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen px-6 sm:px-8 lg:px-12 py-12">
        {/* Quick Stats Overview - Full Width */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-telkom-500 mb-8 text-center">Family Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white border-2 border-telkom-500 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-telkom-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold text-telkom-500 mb-2">Family Members</p>
              <p className="text-3xl font-bold text-telkom-600" data-testid="stat-family-members">
                {stats.familyMembers}
              </p>
            </div>
            
            <div className="bg-white border-2 border-telkom-500 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-telkom-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold text-telkom-500 mb-2">Study Mode</p>
              <p 
                className={`text-3xl font-bold ${stats.studyMode === 'Active' ? 'text-telkom-600' : 'text-gray-400'}`}
                data-testid="stat-study-mode"
              >
                {stats.studyMode}
              </p>
            </div>

            <div className="bg-white border-2 border-telkom-500 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-telkom-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold text-telkom-500 mb-2">Study Time</p>
              <p className="text-3xl font-bold text-telkom-600" data-testid="stat-study-time">
                {stats.studyTime}
              </p>
            </div>

            <div className="bg-white border-2 border-telkom-500 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-telkom-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold text-telkom-500 mb-2">Blocked Apps</p>
              <p className="text-3xl font-bold text-telkom-600" data-testid="stat-blocked-apps">
                {stats.blockedApps}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Better Spacing */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Left Section - Study Controls */}
          <div className="xl:col-span-8 space-y-12">
            <div className="mb-12">
              <StudyModeControl />
            </div>
            <div className="mb-12">
              <FamilyMembers />
            </div>
            <div>
              <UsageReports />
            </div>
          </div>

          {/* Right Section - Management Tools */}
          <div className="xl:col-span-4 space-y-12">
            <div className="mb-12">
              <WhitelistManagement />
            </div>
            <div className="mb-12">
              <BlockedApps />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>

        {/* Footer Spacing */}
        <div className="h-16"></div>
      </main>
    </div>
  );
}
