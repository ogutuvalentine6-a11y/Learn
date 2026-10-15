import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Progress } from "@/models/Progress";
import { requireRole } from "@/lib/auth";
import { adminMarksEditSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = adminMarksEditSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const progress = await Progress.findByIdAndUpdate(
    parsed.data.progressId,
    { score: parsed.data.score },
    { new: true }
  );

  await logAction({
    actorId: auth.id,
    action: "admin_marks_edit",
    target: parsed.data.progressId,
    meta: { score: parsed.data.score },
  });

  return res.status(200).json(progress);
}
