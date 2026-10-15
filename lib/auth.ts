import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import type { NextApiResponse, NextApiRequest } from "next";
import type { Role } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 7;

export interface JwtPayload {
  id: string;
  role: Role;
  email: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    })
  );
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );
}

export function getTokenFromReq(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || "");
  return cookies[COOKIE_NAME] || null;
}

export function getAuthUser(req: NextApiRequest): JwtPayload | null {
  const token = getTokenFromReq(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(req: NextApiRequest, roles: Role[]) {
  const user = getAuthUser(req);
  if (!user || !roles.includes(user.role)) return null;
  return user;
}
