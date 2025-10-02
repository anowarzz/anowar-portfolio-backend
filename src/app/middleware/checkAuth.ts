import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { UserRole } from "../modules/user/user.type";
import { catchAsync } from "../utils/catchAsync";

export const verifyAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new AppError(401, "Access token is required. Please login.");
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (decoded.role !== UserRole.ADMIN) {
        throw new AppError(403, "Admin access required");
      }

      req.user = decoded;
      next();
    } catch {
      // Clear invalid cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new AppError(401, "Invalid or expired token. Please login again.");
    }
  }
);
