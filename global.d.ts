import session from "express-session";

declare global {
  namespace Express {
    interface Session {
      userId?: number; // Add any custom properties to session
    }
  }
}
