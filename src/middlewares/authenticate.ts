import type { NextFunction } from "express";
import type { TReq, TRes } from "../types";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";

const authenticate = (req: TReq, res: TRes, next: NextFunction): void => {
  try {
    
    const token = req.headers.authorization;

    if (!token) {
      sendResponse(
        res,
        { error: true, message: "Access denied. No token provided" },
        401,
      );
      return;
    }

    // verify token & attach user to req
    const decoded = verifyToken(token, 'access');
    req.user = decoded;

    next(); // ✅ move to next middleware/controller
  } catch {
    sendResponse(
      res,
      { error: true, message: "Invalid or expired token" },
      401,
    );
  }
};

export default authenticate;
