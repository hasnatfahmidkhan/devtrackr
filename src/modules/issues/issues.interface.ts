import type { UserRole } from "../Auth/auth.interface";

export type TssueType = "bug" | "feature_request";
export type TssueStatus = "open" | "in_progress" | "resolved";
export type TssueSort = "newest" | "oldest";

// what comes from DB — raw row
export interface IssueRow {
  id: number;
  title: string;
  description: string;
  type: TssueType;
  status: TssueStatus;
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
  type: TssueType;
  status: TssueStatus;
  reporter: ReporterInfo;
  created_at: string;
  updated_at: string;
}

// POST /api/issues body
export interface CreateIssueBody {
  title: string;
  description: string;
  type: TssueType;
}

export interface IssueQueryParams {
  sort?: TssueSort;
  type?: TssueType;
  status?: TssueStatus;
}
