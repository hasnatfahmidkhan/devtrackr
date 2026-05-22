import type { UserRole } from "../Auth/auth.interface";

export type TIssueType = "bug" | "feature_request";
export type TIssueStatus = "open" | "in_progress" | "resolved";
export type TIssueSort = "newest" | "oldest";

// what comes from DB — raw row
export interface IssueRow {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: number;
  created_at: string;
  updated_at: string;
}

// reporter shape inside issue response
export interface ReporterInfo {
  id: number;
  name: string;
  role: UserRole;
}

// what we send to client (no reporter_id, has reporter object)
export interface IIssueResponse {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter: ReporterInfo;
  created_at: string;
  updated_at: string;
}

// POST /api/issues body
export interface CreateIssueBody {
  title: string;
  description: string;
  type: TIssueType;
}

export interface UpdateIssueBody {
  title?: string;
  description?: string;
  type?: TIssueType;
}

export interface IssueQueryParams {
  sort?: TIssueSort;
  type?: TIssueType;
  status?: TIssueStatus;
}
