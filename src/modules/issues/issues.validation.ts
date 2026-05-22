import type { CreateIssueBody, IssueQueryParams, UpdateIssueBody } from "./issues.interface";

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

export const validateIssueQuery = (
  query: IssueQueryParams,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  // validate sort param
  if (query.sort && !["newest", "oldest"].includes(query.sort)) {
    errors.sort = "sort must be newest or oldest";
  }

  // validate type param
  if (query.type && !["bug", "feature_request"].includes(query.type)) {
    errors.type = "type must be bug or feature_request";
  }

  // validate status param
  if (
    query.status &&
    !["open", "in_progress", "resolved"].includes(query.status)
  ) {
    errors.status = "status must be open, in_progress or resolved";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateUpdateIssue = (
  body: UpdateIssueBody,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  // all fields are optional — but if provided, must be valid
  if (body.title !== undefined) {
    if (body.title.trim().length === 0) errors.title = "title cannot be empty";
    else if (body.title.trim().length > 150)
      errors.title = "title must be at most 150 characters";
  }

  if (body.description !== undefined) {
    if (body.description.trim().length === 0)
      errors.description = "description cannot be empty";
    else if (body.description.trim().length < 20)
      errors.description = "description must be at least 20 characters";
  }

  if (body.type !== undefined) {
    if (body.type !== "bug" && body.type !== "feature_request")
      errors.type = "type must be bug or feature_request";
  }

  // at least one field must be provided
  if (
    body.title === undefined &&
    body.description === undefined &&
    body.type === undefined
  ) {
    errors.body =
      "at least one field (title, description, type) must be provided";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
