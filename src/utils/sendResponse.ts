import type { TRes } from "../types";

export const sendResponse = <T>(
  res: TRes,
  {
    message,
    data,
    error,
    errors,
  }: {
    message: string;
    data?: T;
    error?: boolean;
    errors?: unknown;
  },
  statusCode: number,
): Promise<void> => {
  res.status(statusCode).json({
    success: !error,
    message: message,
    data: error ? undefined : data,
    errors: error ? errors : undefined,
  });
};
