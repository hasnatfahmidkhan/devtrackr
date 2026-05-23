# DevTrackr API

A RESTful API for software teams to report bugs, suggest features, and coordinate resolutions.

## 🔗 Live URL

```
https://devtrackr-zeta.vercel.app/
```

---

## 🛠️ Tech Stack

| Technology   | Usage                        |
| ------------ | ---------------------------- |
| Node.js      | LTS runtime                  |
| TypeScript   | Strict type safety           |
| Express.js   | Modular router architecture  |
| PostgreSQL   | Relational database (NeonDB) |
| Raw SQL      | Direct pool.query() — no ORM |
| bcrypt       | Password hashing             |
| jsonwebtoken | JWT authentication           |
| tsup         | TypeScript bundler           |

---

## ✨ Features

- User registration & login with JWT authentication
- Role-based access control (`contributor` / `maintainer`)
- Create, read, update, delete issues
- Filter issues by `type`, `status`
- Sort issues by `newest` or `oldest`
- Centralized error handling
- No SQL JOINs — relational data resolved in application layer

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/hasnatfahmidkhan/devtrackr
cd devtrackr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3000
DATABASE_URL=your_postgesql_database_url_string
ACCESS_SECRET=your_jwt_acccess_token_secret_key_here
REFRESH_SECRET=your_jwt_refresh_token_secret_key_here
```

### 4. Create database tables

Run this SQL on your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    TEXT          NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'contributor'
                            CHECK (role IN ('contributor', 'maintainer')),
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150)  NOT NULL,
  description  TEXT          NOT NULL,
  type         VARCHAR(20)   NOT NULL
                             CHECK (type IN ('bug', 'feature_request')),
  status       VARCHAR(20)   NOT NULL DEFAULT 'open'
                             CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id  INTEGER       NOT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);
```

### 5. Run in development

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
npm start
```

---

## 🌐 API Endpoints

### 🔹 Auth

| Method | Endpoint           | Access | Description       |
| ------ | ------------------ | ------ | ----------------- |
| `POST` | `/api/auth/signup` | Public | Register new user |
| `POST` | `/api/auth/login`  | Public | Login and get JWT |

### 🔹 Issues

| Method   | Endpoint          | Access          | Description      |
| -------- | ----------------- | --------------- | ---------------- |
| `POST`   | `/api/issues`     | Authenticated   | Create new issue |
| `GET`    | `/api/issues`     | Public          | Get all issues   |
| `GET`    | `/api/issues/:id` | Public          | Get single issue |
| `PATCH`  | `/api/issues/:id` | Authenticated   | Update issue     |
| `DELETE` | `/api/issues/:id` | Maintainer only | Delete issue     |

### Query Parameters — `GET /api/issues`

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | —        |
| `status` | `open`, `in_progress`, `resolved` | —        |

---

## 🔐 Authentication

All protected routes require this header:

```
Authorization: <JWT_ACCESS_TOKEN>
```

JWT payload contains:

```json
{
  "id": 1,
  "name": "John Doe",
  "role": "contributor"
}
```

---

## 👥 Roles & Permissions

| Action                            | Contributor | Maintainer |
| --------------------------------- | ----------- | ---------- |
| Register / Login                  | ✅          | ✅         |
| Create issue                      | ✅          | ✅         |
| View all issues                   | ✅          | ✅         |
| Update own issue (only if `open`) | ✅          | ✅         |
| Update any issue                  | ❌          | ✅         |
| Delete any issue                  | ❌          | ✅         |

---

## 🗄️ Database Schema

### `users`

| Column       | Type         | Notes                         |
| ------------ | ------------ | ----------------------------- |
| `id`         | SERIAL       | Primary key, auto-increment   |
| `name`       | VARCHAR(255) | Required                      |
| `email`      | VARCHAR(255) | Required, unique              |
| `password`   | TEXT         | Bcrypt hashed, never returned |
| `role`       | VARCHAR(20)  | `contributor` or `maintainer` |
| `created_at` | TIMESTAMP    | Auto generated on insert      |
| `updated_at` | TIMESTAMP    | Auto updated on update        |

### `issues`

| Column        | Type         | Notes                                      |
| ------------- | ------------ | ------------------------------------------ |
| `id`          | SERIAL       | Primary key, auto-increment                |
| `title`       | VARCHAR(150) | Required, max 150 chars                    |
| `description` | TEXT         | Required, min 20 chars                     |
| `type`        | VARCHAR(20)  | `bug` or `feature_request`                 |
| `status`      | VARCHAR(20)  | `open`, `in_progress`, `resolved`          |
| `reporter_id` | INTEGER      | References users.id (app-level validation) |
| `created_at`  | TIMESTAMP    | Auto generated on insert                   |
| `updated_at`  | TIMESTAMP    | Auto updated on update                     |

---

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   └── issues/
│   │       ├── issues.controller.ts
│   │       ├── issues.interface.ts
│   │       ├── issues.route.ts
│   │       ├── issues.service.ts
│   │       └── issues.validation.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── asyncHandler.ts
│   │   ├── jwt.ts
│   │   └── sendResponse.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── Readme.md
└── tsconfig.json
```

---

## 🚀 Deployment

| Service      | Provider                     |
| ------------ | ---------------------------- |
| **Server**   | [Vercel](https://vercel.com) |
| **Database** | [NeonDB](https://neon.tech)  |

---

## 📬 API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## 🔒 Environment Variables

| Variable             | Description                               |
| -------------------- | ----------------------------------------- |
| `PORT`               | Server port                               |
| `DATABASE_URL`       | PostgreSQL connection string              |
| `JWT_ACCESS_SECRET`  | Secret key for jwt signing access tokens  |
| `JWT_REFRESH_SECRET` | Secret key for jwt signing refresh tokens |
