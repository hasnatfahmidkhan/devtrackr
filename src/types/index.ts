import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface TReq extends Request {
  user?: JwtPayload; // attached after JWT verification
}
export type TRes = Response;
