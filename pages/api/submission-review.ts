import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Progress } from "@/models/Progress";
import { Session } from "@/models/Session";
import { Enrollment } from "@/models/Enrollment";
import { StaffAssignment } from "@/models/StaffAssignment";
import { requireRole } from "@/lib/auth";
import { submissionReviewSchema } from "@/lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["staff", "admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = submissionReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const progress = await Progress.findById(parsed.data.progressId);
  if (!progress) return res.status(404).json({ error: "Not found" });

  const session = await Session.findById(progress.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  if (auth.role === "staff") {
    const assigned = await StaffAssignment.findOne({
      staffId: auth.id,
      courseId: session.courseId,
    });
    if (!assigned) return res.status(403).json({ error: "Not assigned" });
  }

  progress.status = parsed.data.approve ? "passed" : "failed";
  progress.reviewedBy = auth.id as unknown as typeof progress.reviewedBy;
  progress.reviewNote = parsed.data.note;
  await progress.save();

  if (parsed.data.approve) {
    const enrollment = await Enrollment.findOne({
      studentId: progress.studentId,
      courseId: session.courseId,
    });
    if (enrollment) {
      enrollment.currentSessionOrder = Math.max(
        enrollment.currentSessionOrder,
        session.orderIndex + 1
      );
      await enrollment.save();
    }
  }

  return res.status(200).json(progress);
}
