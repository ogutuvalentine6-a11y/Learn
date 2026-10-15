import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { requireRole } from "@/lib/auth";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { courseId } = req.body;
  await connectDB();
  await Course.findByIdAndUpdate(courseId, { isActive: false });
  await logAction({ actorId: auth.id, action: "course_delete", target: courseId });
  return res.status(200).json({ ok: true });
}
