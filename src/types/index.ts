import type { Request, Response } from "express";

export type TReq = Request;
export type TRes = Response;

export type jwtPayload = {
  id: number;
  role: string;
  name: string;
};
