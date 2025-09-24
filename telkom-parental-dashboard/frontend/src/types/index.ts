export interface User {
  id: number;
  username: string;
  role: 'parent' | 'student' | 'admin';
}

export interface StudyRule {
  id: number;
  rule_type: 'whitelist' | 'blacklist';
  domain: string;
  app_name?: string;
}

export interface StudyMode {
  is_enabled: boolean;
  start_time?: string;
  end_time?: string;
}

export interface UsageReport {
  date: string;
  study_time_minutes: number;
  distraction_time_minutes: number;
  efficiency_percentage: number;
}

export interface GameScore {
  game_type: string;
  score: number;
  level: number;
  played_at: string;
}

export interface UsageReportsResponse {
  reports: UsageReport[];
  charts: {
    bar_chart: string;
    pie_chart: string;
  };
  ai_recommendation: string;
}