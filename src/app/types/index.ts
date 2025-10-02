import { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
