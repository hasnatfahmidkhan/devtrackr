import type { SignupBody, LoginBody, UserRole } from "./auth.interface";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Signup Validation ──────────────────────────────────────
export const validateSignup = (
  body: SignupBody,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!body.name || body.name.trim().length === 0)
    errors.name = "name is required";

  if (!body.email || body.email.trim().length === 0)
    errors.email = "email is required";
  else if (!isValidEmail(body.email)) errors.email = "email is invalid";

  if (!body.password || body.password.length === 0)
    errors.password = "password is required";

  const safeRole: UserRole = body.role ?? "contributor";
  if (safeRole !== "contributor" && safeRole !== "maintainer")
    errors.role = "role must be contributor or maintainer";

  return Object.keys(errors).length > 0 ? errors : null;
};

// ── Login Validation ───────────────────────────────────────
export const validateLogin = (
  body: LoginBody,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!body.email || body.email.trim().length === 0)
    errors.email = "email is required";
  else if (!isValidEmail(body.email)) errors.email = "email is invalid";

  if (!body.password || body.password.length === 0)
    errors.password = "password is required";

  return Object.keys(errors).length > 0 ? errors : null;
};
