import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import Stripe from "stripe";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertBeatSchema,
  insertBookingSchema,
  insertContactMessageSchema,
  insertTransactionSchema,
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import "./types";

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable must be set for security");
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable must be set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

const bookingRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().email(),
  phone: z.string().trim().min(7).max(30).optional(),
  service: z.string().trim().min(2).max(200),
  serviceType: z.enum(["studio_booking", "mixing", "licensing", "general"]).default("general"),
  amount: z.number().int().positive(),
  paymentMethod: z.enum(["card", "paypal", "cashapp", "zelle", "crypto"]),
  sessionDate: z.coerce.date().optional(),
  hours: z.number().int().min(1).max(12).optional(),
  notes: z.string().trim().max(1500).optional(),
});

const statusUpdateSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});

const bookingStatusUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

const contactStatusUpdateSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});

const checkoutSchema = bookingRequestSchema.refine(
  (payload) => payload.paymentMethod === "card",
  { message: "Checkout endpoint only supports card payments" },
);

function ensureCsrfToken(req: Request): string {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomUUID();
  }
  return req.session.csrfToken;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const sentToken = req.header("x-csrf-token");
  const sessionToken = req.session.csrfToken;

  if (!sessionToken || !sentToken || sentToken !== sessionToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next();
}

function getPublicBaseUrl(req: Request): string {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL;
  }
  return `${req.protocol}://${req.get("host")}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.post("/api/admin/login", async (req, res) => {
    const clientIp = req.ip || "unknown";
    const { password } = req.body;
    const attemptData = loginAttempts.get(clientIp);
    const now = Date.now();

    if (attemptData && attemptData.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = now - attemptData.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return res.status(429).json({
          success: false,
          message: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
        });
      }
      loginAttempts.delete(clientIp);
    }

    if (password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      const csrfToken = ensureCsrfToken(req);
      loginAttempts.delete(clientIp);
      return res.json({ success: true, csrfToken });
    }

    const attempts = attemptData || { count: 0, lastAttempt: now };
    attempts.count += 1;
    attempts.lastAttempt = now;
    loginAttempts.set(clientIp, attempts);
    return res.status(401).json({ success: false, message: "Invalid password" });
  });

  app.post("/api/admin/logout", requireAdmin, requireCsrf, async (req, res) => {
    req.session.isAdmin = false;
    req.session.csrfToken = undefined;
    res.json({ success: true });
  });

  app.get("/api/admin/check", async (req, res) => {
    const isAdmin = req.session.isAdmin || false;
    const csrfToken = isAdmin ? ensureCsrfToken(req) : undefined;
    res.json({ isAdmin, csrfToken });
  });

  app.get("/api/admin/csrf", requireAdmin, (req, res) => {
    const csrfToken = ensureCsrfToken(req);
    res.json({ csrfToken });
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse({
        ...req.body,
        status: "new",
      });
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/contact", requireAdmin, async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/contact/:id/status", requireAdmin, requireCsrf, async (req, res) => {
    try {
      const { status } = contactStatusUpdateSchema.parse(req.body);
      const message = await storage.updateContactMessageStatus(req.params.id, status);
      if (!message) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      return res.json(message);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const payload = bookingRequestSchema.parse(req.body);

      const booking = await storage.createBooking(
        insertBookingSchema.parse({
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          phone: payload.phone ?? null,
          service: payload.service,
          serviceType: payload.serviceType,
          amount: payload.amount,
          sessionDate: payload.sessionDate ?? null,
          hours: payload.hours ?? null,
          notes: payload.notes ?? null,
          paymentMethod: payload.paymentMethod,
          paymentStatus: "pending",
          status: "pending",
        }),
      );

      const transaction = await storage.createTransaction(
        insertTransactionSchema.parse({
          bookingId: booking.id,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          service: payload.service,
          amount: payload.amount,
          paymentMethod: payload.paymentMethod,
          provider: "manual",
          providerRef: undefined,
          status: "pending",
        }),
      );

      res.status(201).json({ booking, transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/payments/checkout", async (req, res) => {
    try {
      const payload = checkoutSchema.parse(req.body);
      const baseUrl = getPublicBaseUrl(req);

      const booking = await storage.createBooking(
        insertBookingSchema.parse({
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          phone: payload.phone ?? null,
          service: payload.service,
          serviceType: payload.serviceType,
          amount: payload.amount,
          sessionDate: payload.sessionDate ?? null,
          hours: payload.hours ?? null,
          notes: payload.notes ?? null,
          paymentMethod: "card",
          paymentStatus: "pending",
          status: "pending",
        }),
      );

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: payload.service,
              },
              unit_amount: payload.amount,
            },
            quantity: 1,
          },
        ],
        customer_email: payload.customerEmail,
        success_url: `${baseUrl}/?payment=success&booking=${booking.id}`,
        cancel_url: `${baseUrl}/?payment=cancelled&booking=${booking.id}`,
        metadata: {
          bookingId: booking.id,
        },
      });

      const transaction = await storage.createTransaction(
        insertTransactionSchema.parse({
          bookingId: booking.id,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          service: payload.service,
          amount: payload.amount,
          paymentMethod: "card",
          provider: "stripe",
          providerRef: session.id,
          status: "pending",
        }),
      );

      res.status(201).json({
        url: session.url,
        bookingId: booking.id,
        transactionId: transaction.id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");
      }
      if (!req.rawBody) {
        return res.status(400).send("Missing raw body");
      }

      const signature = req.header("stripe-signature");
      if (!signature) {
        return res.status(400).send("Missing stripe-signature header");
      }

      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const providerRef = session.id;
        const bookingId = session.metadata?.bookingId;

        const tx = await storage.getTransactionByProviderRef(providerRef);
        if (tx) {
          await storage.updateTransactionStatus(tx.id, "completed");
        }
        if (bookingId) {
          await storage.updateBookingPaymentStatus(bookingId, "completed");
          await storage.updateBookingStatus(bookingId, "confirmed");
        }
      }

      if (
        event.type === "checkout.session.expired" ||
        event.type === "checkout.session.async_payment_failed"
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        const providerRef = session.id;
        const bookingId = session.metadata?.bookingId;

        const tx = await storage.getTransactionByProviderRef(providerRef);
        if (tx) {
          await storage.updateTransactionStatus(tx.id, "failed");
        }
        if (bookingId) {
          await storage.updateBookingPaymentStatus(bookingId, "failed");
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  app.get("/api/transactions", requireAdmin, async (_req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/transactions/:id/status", requireAdmin, requireCsrf, async (req, res) => {
    try {
      const { status } = statusUpdateSchema.parse(req.body);
      const transaction = await storage.updateTransactionStatus(req.params.id, status);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      return res.json(transaction);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bookings", requireAdmin, async (_req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", requireAdmin, requireCsrf, async (req, res) => {
    try {
      const { status } = bookingStatusUpdateSchema.parse(req.body);
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      return res.json(booking);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", requireAdmin, requireCsrf, async (_req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      res.json({ uploadURL, objectPath });
    } catch (error: any) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/beats", requireAdmin, requireCsrf, async (req, res) => {
    try {
      const validatedData = insertBeatSchema.parse(req.body);
      const objectStorageService = new ObjectStorageService();
      const audioPath = await objectStorageService.trySetObjectEntityAclPolicy(
        validatedData.audioPath,
        { owner: "admin", visibility: "public" },
      );
      const beat = await storage.createBeat({ ...validatedData, audioPath });
      res.json(beat);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/beats", async (_req, res) => {
    try {
      const beats = await storage.getAllBeats();
      res.json(beats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/beats/:id", requireAdmin, requireCsrf, async (req, res) => {
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
