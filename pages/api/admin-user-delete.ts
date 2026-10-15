import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { userId } = req.body;
  if (userId === auth.id) return res.status(400).json({ error: "Cannot delete yourself" });

  await connectDB();
  await User.findByIdAndDelete(userId);
  await logAction({ actorId: auth.id, action: "admin_user_delete", target: userId });
  return res.status(200).json({ ok: true });
}
