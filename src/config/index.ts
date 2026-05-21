import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config({ quiet: true });

export const config = {
  port: env.PORT as string,
  database_url: env.DATABASE_URL as string,
  refresh_secret: env.REFRESH_SECRET as string,
  access_secret: env.ACCESS_SECRET as string,
};
