import type { NextFunction } from "express";
import type { jwtPayload, TReq, TRes } from "../../types";
import asyncHandler from "../../utils/asyncHandler";
import type { SignupBody, UserRole } from "./auth.interface";
import authService from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";

// use regex to validate email
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// set cookie
const setCookie = (res: TRes, name: string, value: string) => {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: "lax",
  });
};

class AuthController {
  // signup
  signup = asyncHandler(async (req: TReq, res: TRes, next: NextFunction) => {
    const { name, email, password, role } = req.body as SignupBody;

    // ---- Validation (400) ----
    const errors: Record<string, string> = {}; // key = field name, value = error message for that field

    if (!name || name.trim().length === 0) errors.name = "name is required";
    if (!email || email.trim().length === 0) errors.email = "email is required";
    else if (!isValidEmail(email)) errors.email = "email is invalid";
    if (!password || password.length === 0)
      errors.password = "password is required";

    const safeRole: UserRole = role ?? "contributor"; // if role is not provided, default to contributor
    if (safeRole !== "contributor" && safeRole !== "maintainer") {
      errors.role = "role must be contributor or maintainer";
    }

    if (Object.keys(errors).length > 0) {
      return sendResponse(
        res,
        { error: true, message: "Validation error", errors },
        400,
      );
    }

    // check if user with email already exists
    const normalizedEmail = email.trim().toLocaleLowerCase();
    const existingUser = await authService.findUserByEmail(normalizedEmail);
    if (existingUser) {
      return sendResponse(
        res,
        {
          error: true,
          message: "User with this email already exists",
          errors: { email: "Email already in use" },
        },
        400,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const payload = {
      name: name.trim(),
      email: email.toLocaleLowerCase(),
      password: passwordHash,
      role: safeRole,
    };

    const newUser = await authService.createUser(payload);

    const jwtPayload = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    } as jwtPayload;

    const { accessToken, refreshToken } = signToken(jwtPayload);

    setCookie(res, "resfreshToken", refreshToken);
    
    return sendResponse(
      res,
      {
        message: "User registered successfully",
        data: { token: accessToken, user: newUser },
      },
      201,
    );
  });

  // login
  login = asyncHandler(async (req: TReq, res: TRes, next: NextFunction) => {});
}

export default new AuthController();
