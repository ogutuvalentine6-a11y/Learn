import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { StaffAssignment } from "@/models/StaffAssignment";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth";
import { adminAssignStaffSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = adminAssignStaffSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const staff = await User.findById(parsed.data.staffId);
  if (!staff) return res.status(404).json({ error: "Staff not found" });
  if (staff.role !== "staff") {
    staff.role = "staff";
    await staff.save();
  }

  const assignment = await StaffAssignment.findOneAndUpdate(
    { staffId: parsed.data.staffId, courseId: parsed.data.courseId },
    { ...parsed.data, assignedBy: auth.id, assignedAt: new Date() },
    { upsert: true, new: true }
  );

  await logAction({
    actorId: auth.id,
    action: "admin_assign_staff",
    target: parsed.data.staffId,
    meta: { courseId: parsed.data.courseId },
  });

  return res.status(200).json(assignment);
}
