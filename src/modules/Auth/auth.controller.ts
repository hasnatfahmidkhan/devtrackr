import type { NextFunction } from "express";
import type { TReq, TRes } from "../../types";
import asyncHandler from "../../utils/asyncHandler";
import type {
  LoginBody,
  SignupBody,
  UserResponse,
  UserRole,
} from "./auth.interface";
import authService from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";
import { validateLogin, validateSignup } from "./auth.validation";
import type { JwtPayload } from "jsonwebtoken";

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

    const errors = validateSignup(req.body as SignupBody);
    if (errors) {
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
      role: role ?? "contributor",
    };

    const newUser = await authService.createUser(payload);

    return sendResponse(
      res,
      {
        message: "User registered successfully",
        data: newUser,
      },
      201,
    );
  });

  // login
  login = asyncHandler(async (req: TReq, res: TRes, next: NextFunction) => {
    const body = req.body as LoginBody;

    const errors = validateLogin(body);
    if (errors) {
      return sendResponse(
        res,
        { error: true, message: "Validation error", errors },
        400,
      );
    }

    const user = (await authService.validateUser(body)) as UserResponse;

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const { accessToken, refreshToken } = signToken(jwtPayload);
    setCookie(res, "refreshToken", refreshToken);

    return sendResponse(
      res,
      {
        message: "Login successful",
        data: { token: accessToken, user: user },
      },
      200,
    );
  });
}

export default new AuthController();
