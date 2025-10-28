import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBeatSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import "./types";

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable must be set for security");
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    const clientIp = req.ip || "unknown";
    const { password } = req.body;
    
    const attemptData = loginAttempts.get(clientIp);
    const now = Date.now();

    if (attemptData) {
      if (attemptData.count >= MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = now - attemptData.lastAttempt;
        if (timeSinceLastAttempt < LOCKOUT_DURATION) {
          const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
          return res.status(429).json({ 
            success: false, 
            message: `Too many login attempts. Please try again in ${remainingTime} minutes.` 
          });
        } else {
          loginAttempts.delete(clientIp);
        }
      }
    }
    
    if (password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      loginAttempts.delete(clientIp);
      res.json({ success: true });
    } else {
      const attempts = attemptData || { count: 0, lastAttempt: now };
      attempts.count += 1;
      attempts.lastAttempt = now;
      loginAttempts.set(clientIp, attempts);
      
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.isAdmin = false;
    res.json({ success: true });
  });

  app.get("/api/admin/check", async (req, res) => {
    res.json({ isAdmin: req.session.isAdmin || false });
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Object storage routes - Reference: blueprint:javascript_object_storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      // Extract the object path from the upload URL for later use
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      
      res.json({ uploadURL, objectPath });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Beats routes
  app.post("/api/beats", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertBeatSchema.parse(req.body);
      
      const objectStorageService = new ObjectStorageService();
      
      // Normalize path and set public ACL policy
      const audioPath = await objectStorageService.trySetObjectEntityAclPolicy(
        validatedData.audioPath,
        {
          owner: "admin",
          visibility: "public",
        }
      );
      
      const beat = await storage.createBeat({
        ...validatedData,
        audioPath,
      });
      res.json(beat);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/beats", async (req, res) => {
    try {
      const beats = await storage.getAllBeats();
      res.json(beats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/beats/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      await storage.deleteBeat(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
