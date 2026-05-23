import type { NextFunction } from "express";
import type { TReq, TRes } from "../types";
import { sendResponse } from "../utils/sendResponse";

// catches any request that didn't match a route
const notFound = (req: TReq, res: TRes, next: NextFunction): void => {
  sendResponse(
    res,
    {
      error: true,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
    404,
  );
};

export default notFound;
