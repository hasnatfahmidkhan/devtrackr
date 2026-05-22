import type { NextFunction } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler";
import type { TReq, TRes } from "../../types";
import type {
  CreateIssueBody,
  IIssueResponse,
  IssueQueryParams,
  IssueRow,
} from "./issues.interface";
import { validateCreateIssue, validateIssueQuery } from "./issues.validation";
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

  // get all issues
  getAllIssues = asyncHandler(
    async (req: TReq, res: TRes, next: NextFunction) => {
      const query = req.query as IssueQueryParams;
      const errors = validateIssueQuery(query);
      if (errors) {
        return sendResponse(
          res,
          {
            error: true,
            message: "Validation error",
            errors,
          },
          400,
        );
      }

      const issues: IssueRow[] = await issuesService.getAllIssue(query);
      // get unique reporter ids
      const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
      const reportersInfo = await issuesService.getReportersByIds(reporterIds);

      const data: IIssueResponse[] = issues.map((issue) => {
        const { reporter_id, ...rest } = issue;
        return {
          ...rest,
          reporter: reportersInfo.get(reporter_id) ?? {
            id: reporter_id,
            name: "Unknown",
            role: "contributor",
          },
        };
      });

      sendResponse(
        res,
        {
          message: "Issues fetched successfully",
          data: data,
        },
        200,
      );
    },
  );

  // get signle issue
  getIssueById = asyncHandler(
    async (req: TReq, res: TRes, next: NextFunction) => {
      const id = Number(req.params.id);
      // validate id is a number
      if (isNaN(id)) {
        return sendResponse(
          res,
          { error: true, message: "Invalid issue id" },
          400,
        );
      }

      const issue = await issuesService.findIssueById(id);
      if (!issue) {
        return sendResponse(
          res,
          { error: true, message: "Issue not found" },
          404,
        );
      }

      // fetch reporter info
      const reporterInfo = await issuesService.getReportersByIds([
        issue.reporter_id,
      ]);

      const { reporter_id, ...rest } = issue;
      const data: IIssueResponse = {
        ...rest,
        reporter: reporterInfo.get(reporter_id) ?? {
          id: reporter_id,
          name: "Unknown",
          role: "contributor",
        },
      };

      return sendResponse(
        res,
        { message: "Issue fetched successfully", data },
        200,
      );
    },
  );
}

export default new IssuesController();
