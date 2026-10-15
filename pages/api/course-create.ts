import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { requireRole } from "@/lib/auth";
import { courseCreateSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = courseCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const course = await Course.create({ ...parsed.data, createdBy: auth.id });
  await logAction({ actorId: auth.id, action: "course_create", target: course._id.toString() });
  return res.status(201).json(course);
}
