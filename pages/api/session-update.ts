import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { StaffAssignment } from "@/models/StaffAssignment";
import { requireRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["staff", "admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { sessionId, ...updates } = req.body;
  await connectDB();
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: "Not found" });

  if (auth.role === "staff") {
    const assigned = await StaffAssignment.findOne({
      staffId: auth.id,
      courseId: session.courseId,
    });
    if (!assigned) return res.status(403).json({ error: "Not assigned" });
  }

  const updated = await Session.findByIdAndUpdate(sessionId, updates, { new: true });
  return res.status(200).json(updated);
}
