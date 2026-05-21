import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import { config } from "../config";



export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret = type === "refresh" ? config.refresh_secret : config.access_secret as Secret;
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

export const signToken = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.access_secret, {
    expiresIn: "7d",
  });

  const refreshToken = jwt.sign(payload, config.refresh_secret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};