import type { NextFunction } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler";
import type { TReq, TRes } from "../../types";
import type { CreateIssueBody } from "./issues.interface";
import { validateCreateIssue } from "./issues.validation";
import { sendResponse } from "../../utils/sendResponse";
import issuesService from "./issues.service";

class IssuesController {
  // create issue
  createIssue = asyncHandler(
    async (req: TReq, res: TRes, next: NextFunction) => {
      const body = req.body as CreateIssueBody;

      // validate input
      const errors = validateCreateIssue(body);
      if (errors) {
        return sendResponse(
          res,
          { error: true, message: "Validation error", errors },
          400,
        );
      }

      // reporter_id comes from JWT — not from request body
      const reporterId = req.user!.id; //? "!" means must have id say to ts  

      const newIssue = await issuesService.createIssue(body, reporterId);

      return sendResponse(
        res,
        { message: "Issue created successfully", data: newIssue },
        201,
      );
    },
  );
}

export default new IssuesController();
