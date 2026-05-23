import type { NextFunction } from "express";
import { AppError } from "../utils/AppError";
import type { TReq, TRes } from "../types";

export const globalErrorHandler = (err: unknown, req: TReq, res: TRes) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
