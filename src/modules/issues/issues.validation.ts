import type { CreateIssueBody } from "./issues.interface";

export const validateCreateIssue = (
  body: CreateIssueBody,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!body.title || body.title.trim().length === 0)
    errors.title = "title is required";
  else if (body.title.trim().length > 150)
    errors.title = "title must be at most 150 characters";

  if (!body.description || body.description.trim().length === 0)
    errors.description = "description is required";
  else if (body.description.trim().length < 20)
    errors.description = "description must be at least 20 characters";

  if (!body.type) errors.type = "type is required";
  else if (body.type !== "bug" && body.type !== "feature_request")
    errors.type = "type must be bug or feature_request";

  return Object.keys(errors).length > 0 ? errors : null;
};
