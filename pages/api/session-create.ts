import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { StaffAssignment } from "@/models/StaffAssignment";
import { requireRole } from "@/lib/auth";
import { sessionCreateSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["staff", "admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = sessionCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  if (auth.role === "staff") {
    const assigned = await StaffAssignment.findOne({
      staffId: auth.id,
      courseId: parsed.data.courseId,
    });
    if (!assigned) return res.status(403).json({ error: "Not assigned to this course" });
  }

  const session = await Session.create(parsed.data);
  await logAction({ actorId: auth.id, action: "session_create", target: session._id.toString() });
  return res.status(201).json(session);
}
