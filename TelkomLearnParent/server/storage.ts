import { 
  type FamilyMember, 
  type InsertFamilyMember,
  type WhitelistSite,
  type InsertWhitelistSite,
  type BlockedApp,
  type InsertBlockedApp,
  type Settings,
  type InsertSettings,
  type UsageReport,
  type InsertUsageReport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Family Members
  getFamilyMembers(): Promise<FamilyMember[]>;
  getFamilyMember(id: string): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: string, member: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: string): Promise<boolean>;

  // Whitelist Sites
  getWhitelistSites(): Promise<WhitelistSite[]>;
  createWhitelistSite(site: InsertWhitelistSite): Promise<WhitelistSite>;
  deleteWhitelistSite(id: string): Promise<boolean>;

  // Blocked Apps
  getBlockedApps(): Promise<BlockedApp[]>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  // Usage Reports
  getUsageReport(): Promise<UsageReport>;
}

export class MemStorage implements IStorage {
  private familyMembers: Map<string, FamilyMember>;
  private whitelistSites: Map<string, WhitelistSite>;
  private blockedApps: Map<string, BlockedApp>;
  private settings!: Settings;
  private usageReport!: UsageReport;

  constructor() {
    this.familyMembers = new Map();
    this.whitelistSites = new Map();
    this.blockedApps = new Map();
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo family members
    const demoMembers: FamilyMember[] = [
      {
        id: '1',
        name: 'Emily Johnson',
        role: 'student',
        age: 14,
        status: 'online',
        studyTime: '2.5 hrs study',
        studyProgress: 75,
        initials: 'EM'
      },
      {
        id: '2',
        name: 'Alex Johnson',
        role: 'student',
        age: 12,
        status: 'offline',
        studyTime: '1.8 hrs study',
        studyProgress: 60,
        initials: 'AJ'
      },
      {
        id: '3',
        name: 'Michael Johnson',
        role: 'adult',
        age: 22,
        status: 'online',
        studyTime: 'Self-managed',
        studyProgress: 100,
        initials: 'MJ'
      }
    ];

    demoMembers.forEach(member => {
      this.familyMembers.set(member.id, member);
    });

    // Demo whitelist sites
    const demoSites: WhitelistSite[] = [
      { id: '1', name: 'Khan Academy', url: 'khanacademy.org' },
      { id: '2', name: 'Coursera', url: 'coursera.org' },
      { id: '3', name: 'edX', url: 'edx.org' }
    ];

    demoSites.forEach(site => {
      this.whitelistSites.set(site.id, site);
    });

    // Demo blocked apps
    const demoBlockedApps: BlockedApp[] = [
      { id: '1', name: 'TikTok', category: 'Social Media', status: 'blocked' },
      { id: '2', name: 'Instagram', category: 'Social Media', status: 'blocked' },
      { id: '3', name: 'YouTube Entertainment', category: 'Video Platform', status: 'blocked' },
      { id: '4', name: 'Gaming Sites', category: 'Entertainment', status: 'blocked' }
    ];

    demoBlockedApps.forEach(app => {
      this.blockedApps.set(app.id, app);
    });

    // Default settings
    this.settings = {
      id: 'main',
      studyModeEnabled: true,
      weekdayHours: '6:00 AM - 9:00 PM',
      weekendHours: '8:00 AM - 8:00 PM',
      lunchBreak: '12:00 - 1:00 PM',
      dinnerBreak: '6:00 - 7:00 PM'
    };

    // Default usage report
    this.usageReport = {
      id: 'main',
      totalStudyTime: '18.5 hrs',
      distractionTime: '6.2 hrs',
      efficiency: '75%',
      aiRecommendation: 'Study efficiency is excellent this week! Consider maintaining current restrictions to keep the positive momentum.'
    };
  }

  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values());
  }

  async getFamilyMember(id: string): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const id = randomUUID();
    const newMember: FamilyMember = { 
      ...member, 
      id,
      status: member.status || 'offline',
      studyTime: member.studyTime || '0 hrs',
      studyProgress: member.studyProgress || 0
    };
    this.familyMembers.set(id, newMember);
    return newMember;
  }

  async updateFamilyMember(id: string, member: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined> {
    const existing = this.familyMembers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...member };
    this.familyMembers.set(id, updated);
    return updated;
  }

  async deleteFamilyMember(id: string): Promise<boolean> {
    return this.familyMembers.delete(id);
  }

  // Whitelist Sites
  async getWhitelistSites(): Promise<WhitelistSite[]> {
    return Array.from(this.whitelistSites.values());
  }

  async createWhitelistSite(site: InsertWhitelistSite): Promise<WhitelistSite> {
    const id = randomUUID();
    const newSite: WhitelistSite = { ...site, id };
    this.whitelistSites.set(id, newSite);
    return newSite;
  }

  async deleteWhitelistSite(id: string): Promise<boolean> {
    return this.whitelistSites.delete(id);
  }

  // Blocked Apps
  async getBlockedApps(): Promise<BlockedApp[]> {
    return Array.from(this.blockedApps.values());
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(newSettings: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  // Usage Reports
  async getUsageReport(): Promise<UsageReport> {
    return this.usageReport;
  }
}

export const storage = new MemStorage();
