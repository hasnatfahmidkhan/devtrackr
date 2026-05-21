import type { TRes } from "../types";

export const sendResponse = async <T>(
  res: TRes,
  { message, data, error }: { message: string; data?: T; error?: boolean },
  statusCode: number,
): Promise<void> => {
  res.status(statusCode).json({
    success: !error,
    message: message,
    data: error ? undefined : data,
  });
};
