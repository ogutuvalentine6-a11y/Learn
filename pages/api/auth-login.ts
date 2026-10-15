import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { enforceRateLimit, authLimiter } from "@/lib/rate-limit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ok = await enforceRateLimit(authLimiter, req);
  if (!ok) return res.status(429).json({ error: "Too many requests" });

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (user.status === "blocked") return res.status(403).json({ error: "Account blocked" });

  const valid = await comparePassword(parsed.data.password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  setAuthCookie(res, token);

  return res.status(200).json({
    id: user._id,
    role: user.role,
    email: user.email,
    fullName: user.fullName,
  });
}
