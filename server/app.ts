import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import "./types";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(options: { windowMs: number; max: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const current = rateLimits.get(key);

    if (!current || now > current.resetAt) {
      rateLimits.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (current.count >= options.max) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    current.count += 1;
    rateLimits.set(key, current);
    return next();
  };
}

export async function createConfiguredServer() {
  const app = express();
  app.use(express.json({
    verify: (req: Request, _res, buf) => {
      if (req.originalUrl === "/api/payments/webhook") {
        req.rawBody = Buffer.from(buf);
      }
    },
  }));
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/admin/login", rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }));
  app.use("/api", (req, res, next) => {
    if (req.path === "/payments/webhook") {
      return next();
    }
    if (req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") {
      return rateLimiter({ windowMs: 60 * 1000, max: 60 })(req, res, next);
    }
    return next();
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: "tfb.sid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse && !path.includes("/login") && !path.includes("/payments/webhook")) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        log(logLine);
      }
    });

    next();
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return { app, server };
}
