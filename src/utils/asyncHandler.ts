import type { NextFunction } from "express";
import type { TReq, TRes } from "../types";

type TAsyncHandler = (
  req: TReq,
  res: TRes,
  next: NextFunction,
) => Promise<void>;

const asyncHandler = (fn: TAsyncHandler) => {
  return (req: TReq, res: TRes, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
