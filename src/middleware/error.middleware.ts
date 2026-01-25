import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http_error";

export const errorMiddleware = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err instanceof HttpError ? err.message : err.message;

  const status = err instanceof HttpError ? err.status : 500;

  return res.status(status).json({
    success: false,
    error: message,
  });
};
