import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config();

export const config = {
  port: env.PORT,
  database_url: env.DATABASE_URL,
};
