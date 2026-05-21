import type { NextFunction } from "express";
import type { TReq, TRes } from "../types";
import { sendResponse } from "../utils/sendResponse";
import type { UserRole } from "../modules/Auth/auth.interface";

// accepts one or more allowed roles
const authorize = (...allowedRoles: UserRole[]) => {
  return (req: TReq, res: TRes, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      sendResponse(
        res,
        {
          error: true,
          message: "Access denied. Insufficient permissions",
        },
        403,
      );
      return;
    }

    next();
  };
};

export default authorize;
