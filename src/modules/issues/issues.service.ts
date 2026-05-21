import { pool } from "../../db";
import type { CreateIssueBody, IssueRow } from "./issues.interface";

class IssuesService {
  // create issue
  async createIssue(
    payload: CreateIssueBody,
    reporterId: number,
  ): Promise<IssueRow> {
    const { title, description, type } = payload;

    const result = await pool.query(
      `INSERT INTO issues (title, description, type, reporter_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;`,
      [title.trim(), description.trim(), type, reporterId],
    );

    return result.rows[0] as IssueRow;
  }
}

export default new IssuesService();
