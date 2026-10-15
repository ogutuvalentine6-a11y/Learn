import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { requireRole } from "@/lib/auth";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { courseId, ...updates } = req.body;
  if (!courseId) return res.status(400).json({ error: "courseId required" });

  await connectDB();
  const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
  await logAction({ actorId: auth.id, action: "course_update", target: courseId });
  return res.status(200).json(course);
}
