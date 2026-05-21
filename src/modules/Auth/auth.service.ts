import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { LoginBody, SignupBody, UserResponse } from "./auth.interface";
import { AppError } from "../../utils/AppError";

class AtuhService {
  // find user by email
  async findUserByEmail(email: string): Promise<UserResponse | null> {
    const result = await pool.query(
      `SELECT id, name, email, password, role, created_at, updated_at
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

  // login
  async validateUser(payload: LoginBody) {
    const { email, password } = payload;
    // find user
    const user = (await this.findUserByEmail(
      email.trim().toLocaleLowerCase(),
    )) as UserResponse & { password: string };
    if (!user) {
      throw new AppError("User not found. Please register", 404);
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }

    const { password: _, ...validUser } = user;
    return validUser;
  }
}

export default new AtuhService();
