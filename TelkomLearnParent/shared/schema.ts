import { pgTable, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'parent', 'student', 'adult'
  age: integer("age").notNull(),
  status: text("status").notNull().default('offline'), // 'online', 'offline'
  studyTime: text("study_time").default('0 hrs'),
  studyProgress: integer("study_progress").default(0), // 0-100
  initials: text("initials").notNull(),
});

export const whitelistSites = pgTable("whitelist_sites", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
});

export const blockedApps = pgTable("blocked_apps", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default('blocked'),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default('main'),
  studyModeEnabled: boolean("study_mode_enabled").default(true),
  weekdayHours: text("weekday_hours").default('6:00 AM - 9:00 PM'),
  weekendHours: text("weekend_hours").default('8:00 AM - 8:00 PM'),
  lunchBreak: text("lunch_break").default('12:00 - 1:00 PM'),
  dinnerBreak: text("dinner_break").default('6:00 - 7:00 PM'),
});

export const usageReports = pgTable("usage_reports", {
  id: varchar("id").primaryKey(),
  totalStudyTime: text("total_study_time").default('18.5 hrs'),
  distractionTime: text("distraction_time").default('6.2 hrs'),
  efficiency: text("efficiency").default('75%'),
  aiRecommendation: text("ai_recommendation").default('Study efficiency is excellent this week! Consider maintaining current restrictions to keep the positive momentum.'),
});

// Insert schemas
export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
});

export const insertWhitelistSiteSchema = createInsertSchema(whitelistSites).omit({
  id: true,
});

export const insertBlockedAppSchema = createInsertSchema(blockedApps).omit({
  id: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export const insertUsageReportSchema = createInsertSchema(usageReports).omit({
  id: true,
});

// Types
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type WhitelistSite = typeof whitelistSites.$inferSelect;
export type InsertWhitelistSite = z.infer<typeof insertWhitelistSiteSchema>;

export type BlockedApp = typeof blockedApps.$inferSelect;
export type InsertBlockedApp = z.infer<typeof insertBlockedAppSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type UsageReport = typeof usageReports.$inferSelect;
export type InsertUsageReport = z.infer<typeof insertUsageReportSchema>;
