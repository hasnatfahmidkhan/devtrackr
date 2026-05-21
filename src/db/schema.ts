import { pool } from ".";

export const createSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      role        VARCHAR(20) NOT NULL
                  DEFAULT 'contributor'
                  -- role column only allows these two values
                  CHECK (role IN ('contributor', 'maintainer')),
      created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(150) NOT NULL,
      description  TEXT NOT NULL,

      type         VARCHAR(20) NOT NULL
                   -- issue type must be either bug or feature request
                   CHECK (type IN ('bug', 'feature_request')),

      status       VARCHAR(20) NOT NULL
                   DEFAULT 'open'
                   -- issue lifecycle status restriction
                   CHECK (status IN ('open', 'in_progress', 'resolved')),

      reporter_id  INTEGER NOT NULL,
      -- stores user id who created the issue

      created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
};