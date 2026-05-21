import express from "express";
import type { TReq, TRes } from "./types";
import { sendResponse } from "./utils/sendResponse";
import { authRoute } from "./modules/Auth/auth.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { issuesRoute } from "./modules/issues/issues.route";

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
// routes
app.get("/", async (req: TReq, res: TRes) => {
  sendResponse(
    res,
    {
      message: "DevPlus Server is running!",
      data: undefined,
    },
    200,
  );
});

// Auth routes
app.use("/api/auth", authRoute);

// Issues routes
app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);
export default app;
