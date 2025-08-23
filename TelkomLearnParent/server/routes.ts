import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFamilyMemberSchema, 
  insertWhitelistSiteSchema,
  insertSettingsSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Family Members routes
  app.get("/api/family-members", async (req, res) => {
    try {
      const members = await storage.getFamilyMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family members" });
    }
  });

  app.post("/api/family-members", async (req, res) => {
    try {
      const validatedData = insertFamilyMemberSchema.parse(req.body);
      const newMember = await storage.createFamilyMember(validatedData);
      res.status(201).json(newMember);
    } catch (error) {
      res.status(400).json({ message: "Invalid family member data" });
    }
  });

  app.put("/api/family-members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFamilyMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateFamilyMember(id, validatedData);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Family member not found" });
      }
      
      res.json(updatedMember);
    } catch (error) {
      res.status(400).json({ message: "Invalid family member data" });
    }
  });

  app.delete("/api/family-members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFamilyMember(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Family member not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete family member" });
    }
  });

  // Whitelist Sites routes
  app.get("/api/whitelist-sites", async (req, res) => {
    try {
      const sites = await storage.getWhitelistSites();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch whitelist sites" });
    }
  });

  app.post("/api/whitelist-sites", async (req, res) => {
    try {
      const validatedData = insertWhitelistSiteSchema.parse(req.body);
      const newSite = await storage.createWhitelistSite(validatedData);
      res.status(201).json(newSite);
    } catch (error) {
      res.status(400).json({ message: "Invalid whitelist site data" });
    }
  });

  app.delete("/api/whitelist-sites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWhitelistSite(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Whitelist site not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete whitelist site" });
    }
  });

  // Blocked Apps routes
  app.get("/api/blocked-apps", async (req, res) => {
    try {
      const apps = await storage.getBlockedApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blocked apps" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Usage Reports routes
  app.get("/api/usage-report", async (req, res) => {
    try {
      const report = await storage.getUsageReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch usage report" });
    }
  });

  // Quick Actions routes
  app.post("/api/quick-actions/pause-internet", async (req, res) => {
    try {
      // In a real implementation, this would pause internet for all devices
      res.json({ message: "Internet paused for all family members" });
    } catch (error) {
      res.status(500).json({ message: "Failed to pause internet" });
    }
  });

  app.post("/api/quick-actions/emergency-unblock", async (req, res) => {
    try {
      // In a real implementation, this would temporarily remove all restrictions
      res.json({ message: "All restrictions temporarily removed for 30 minutes" });
    } catch (error) {
      res.status(500).json({ message: "Failed to emergency unblock" });
    }
  });

  app.post("/api/quick-actions/weekly-report", async (req, res) => {
    try {
      // In a real implementation, this would generate and email a report
      res.json({ message: "Weekly report has been sent to your email" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send weekly report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
