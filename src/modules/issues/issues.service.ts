import { pool } from "../../db";
import type {
  CreateIssueBody,
  IssueQueryParams,
  IssueRow,
  ReporterInfo,
  UpdateIssueBody,
} from "./issues.interface";

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

  //   get all issue
  async getAllIssue(query: IssueQueryParams) {
    const { sort = "newest", status, type } = query;

    // stores dynamic WHERE conditions
    // example: ["type = $1", "status = $2"]
    const conditions: string[] = [];

    // stores values for parameterized query
    // example: ["bug", "open"]
    const values: unknown[] = [];

    // PostgreSQL parameter index tracker ($1, $2, $3...)
    let paramIndex = 1;

    // add type filter if provided
    if (type) {
      conditions.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    // add status filter if provided
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    // build WHERE clause dynamically
    // if conditions exist:
    // WHERE type = $1 AND status = $2
    // otherwise empty string
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // build ORDER BY clause based on sort value
    // oldest -> ascending order
    // newest -> descending order (default)
    const orderClause =
      sort === "oldest"
        ? "ORDER BY created_at ASC"
        : "ORDER BY created_at DESC";

    const result = await pool.query(
      `
            SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
            FROM issues
            ${whereClause}
            ${orderClause}
            
            `,
      values,
    );

    return result.rows as IssueRow[];
  }

  //   getReportersByIds
  async getReportersByIds(ids: number[]): Promise<Map<number, ReporterInfo>> {
    if (ids.length === 0) return new Map();

    // build placeholders for SQL IN clause
    // example: [1,2,3] → "$1, $2, $3"
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");

    // fetch users from DB whose id matches given ids
    const result = await pool.query(
      `
        SELECT id, name, role
        FROM users 
        WHERE id IN (${placeholders})
        `,
      ids,
    );

    // create Map for fast lookup
    // key = user id
    // value = ReporterInfo object
    const reporterMap = new Map<number, ReporterInfo>();

    for (const row of result.rows) {
      // store each user in map
      reporterMap.set(row.id, {
        id: row.id,
        name: row.name,
        role: row.role,
      });
    }
    return reporterMap;
  }

  //   find issue by id
  async findIssueById(id: number) {
    const result = await pool.query(
      `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
       FROM issues WHERE id = $1 LIMIT 1;`,
      [id],
    );
    return result.rows.length === 0 ? null : (result.rows[0] as IssueRow);
  }

  // update issue
  async updateIssue(id: number, payload: UpdateIssueBody) {
    // build SET clause dynamically — only update provided fields
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    if (payload.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(payload.title.trim());
      paramIndex++;
    }

    if (payload.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(payload.description.trim());
      paramIndex++;
    }

    if (payload.type !== undefined) {
      fields.push(`type = $${paramIndex}`);
      values.push(payload.type);
      paramIndex++;
    }

    // always update updated_at
    fields.push(`updated_at = NOW()`);

    // add id as last param for WHERE clause
    values.push(id);

    const result = await pool.query(
      `UPDATE issues
       SET ${fields.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;`,
      values,
    );
    return result.rows[0] as IssueRow;
  }

  async deleteIssue(id: number) {
    await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);
  }
}

export default new IssuesService();
