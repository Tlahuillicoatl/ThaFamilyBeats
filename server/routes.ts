import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBeatSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { Client as ObjectStorageClient } from "@replit/object-storage";
import { randomUUID } from "crypto";
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
    try {
      // Extract the object path from the URL
      const objectPath = req.params.objectPath;
      console.log(`Serving object: ${objectPath}`);
      
      // Use Replit Object Storage client
      const client = new ObjectStorageClient();
      
      // Check if file exists first
      const existsResult = await client.exists(objectPath);
      if (!existsResult.ok || !existsResult.value) {
        console.error(`Object not found: ${objectPath}`);
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Determine content type based on file extension
      const extension = objectPath.split('.').pop()?.toLowerCase();
      const contentType = extension === 'mp3' ? 'audio/mpeg' :
                         extension === 'wav' ? 'audio/wav' :
                         extension === 'ogg' ? 'audio/ogg' :
                         'application/octet-stream';
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      });
      
      // Download and pipe the stream to the response
      const stream = await client.downloadAsStream(objectPath);
      stream.pipe(res);
    } catch (error: any) {
      console.error("Error serving object:", error);
      return res.status(500).json({ error: 'Error serving file' });
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const chunks: Buffer[] = [];
      
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      req.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          
          // Generate unique filename
          const fileId = randomUUID();
          const contentType = req.headers['content-type'] || 'audio/mpeg';
          const extension = contentType.includes('mpeg') ? 'mp3' : 
                           contentType.includes('wav') ? 'wav' : 
                           contentType.includes('ogg') ? 'ogg' : 'audio';
          const filename = `public/beats/${fileId}.${extension}`;
          
          console.log(`Uploading file: ${filename}, size: ${buffer.length} bytes`);
          
          // Upload using Replit Object Storage client
          const client = new ObjectStorageClient();
          const result = await client.uploadFromBytes(filename, buffer);
          
          if (!result.ok) {
            console.error('Upload failed:', result.error);
            return res.status(500).json({ message: result.error });
          }
          
          console.log('Upload successful:', filename);
          
          // Return the public path
          const publicPath = `/objects/${filename}`;
          res.json({ objectPath: publicPath });
        } catch (error: any) {
          console.error('Error processing upload:', error);
          res.status(500).json({ message: error.message });
        }
      });
      
      req.on('error', (error) => {
        console.error('Upload stream error:', error);
        res.status(500).json({ message: 'Upload failed' });
      });
    } catch (error: any) {
      console.error("Error handling upload:", error);
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
