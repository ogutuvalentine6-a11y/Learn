import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";
import { enforceRateLimit, authLimiter } from "@/lib/rate-limit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ok = await enforceRateLimit(authLimiter, req);
  if (!ok) return res.status(429).json({ error: "Too many requests" });

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hashed = await hashPassword(parsed.data.password);
  const user = await User.create({ ...parsed.data, password: hashed, role: "student" });

  await logAction({ actorId: user._id.toString(), action: "register", target: user.email });

  return res.status(201).json({ id: user._id, email: user.email });
}
