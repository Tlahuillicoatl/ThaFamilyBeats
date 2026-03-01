import "express-session";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    csrfToken?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}
