import { pool } from "../../db";
import type { SignupBody, UserResponse } from "./auth.interface";

class AtuhService {
  // find user by email
  async findUserByEmail(email: string): Promise<UserResponse | null> {
    const result = await pool.query(
      `SELECT email
       FROM users WHERE email = $1 LIMIT 1;`, // return only 1 row even if there are multiple matches 
      [email],
    );
    return result.rows.length === 0 ? null : (result.rows[0] as UserResponse);
  }

  // create user
  async createUser(payload: SignupBody): Promise<UserResponse> {
    const { email, name, password, role } = payload;
    const result = await pool.query(
      `
        INSERT INTO users (name, email, password, role)
        VALUES($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at;
        `,
      [name, email, password, role],
    );
    return result.rows[0] as UserResponse;
  }
}

export default new AtuhService();
