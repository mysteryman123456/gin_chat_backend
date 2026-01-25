import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http_error";
import { JwtPayload } from "../types/user";
import { JwtUtil } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token) return next(new HttpError("Authentication token missing", 401));

  try {
    const user = JwtUtil.verifyToken(token);
    req.user = user;
    next();
  } catch {
    throw new HttpError("Invalid token", 401);
  }
};
