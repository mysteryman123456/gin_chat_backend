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
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(new HttpError("Authentication token missing", 401));

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(new HttpError("Invalid authorization format", 401));
  }

  const token = parts[1];

  try {
    const user = JwtUtil.verifyToken(token);
    req.user = user;
    next();
  } catch {
    throw new HttpError("Invalid token", 401);
  }
};
