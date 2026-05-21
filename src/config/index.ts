import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config({ quiet: true });

export const config = {
  port: env.PORT,
  database_url: env.DATABASE_URL,
};
