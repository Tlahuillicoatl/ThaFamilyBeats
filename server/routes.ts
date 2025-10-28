import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
