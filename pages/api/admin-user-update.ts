import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth";
import { adminUserUpdateSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = adminUserUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { userId, ...updates } = parsed.data;
  await connectDB();
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
  await logAction({ actorId: auth.id, action: "admin_user_update", target: userId, meta: updates });
  return res.status(200).json(user);
}
