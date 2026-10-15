import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { Progress } from "@/models/Progress";
import { Enrollment } from "@/models/Enrollment";
import { requireRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["student"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { sessionId } = req.body;
  await connectDB();

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const enrollment = await Enrollment.findOne({
    studentId: auth.id,
    courseId: session.courseId,
    paymentStatus: "paid",
  });
  if (!enrollment) return res.status(403).json({ error: "Course not paid" });

  const prior = await Progress.findOne({
    studentId: auth.id,
    sessionId,
  });

  if (prior && ["passed", "awaiting_review"].includes(prior.status)) {
    return res.status(200).json(prior);
  }

  const progress = await Progress.findOneAndUpdate(
    { studentId: auth.id, sessionId },
    {
      studentId: auth.id,
      courseId: session.courseId,
      sessionId,
      status: "in_progress",
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(progress);
}
