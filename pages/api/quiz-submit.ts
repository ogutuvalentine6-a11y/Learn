import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { Progress } from "@/models/Progress";
import { Enrollment } from "@/models/Enrollment";
import { requireRole } from "@/lib/auth";
import { quizSubmitSchema } from "@/lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["student"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = quizSubmitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const session = await Session.findById(parsed.data.sessionId);
  if (!session || !session.quiz) return res.status(400).json({ error: "No quiz for session" });

  const progress = await Progress.findOne({ studentId: auth.id, sessionId: session._id });
  if (!progress) return res.status(400).json({ error: "Start session first" });

  if (progress.status === "passed") return res.status(200).json(progress);

  if (!progress.quizStartedAt) {
    progress.quizStartedAt = new Date();
    await progress.save();
  }

  const elapsed = (Date.now() - new Date(progress.quizStartedAt).getTime()) / 1000;
  if (elapsed > session.quiz.timerSeconds) {
    progress.status = "failed";
    progress.score = 0;
    progress.quizStartedAt = null;
    await progress.save();
    return res.status(200).json({ failed: true, reason: "timeout", progress });
  }

  const correct = parsed.data.selectedIndex === session.quiz.correctIndex;
  const score = correct ? 100 : 0;
  progress.score = score;
  progress.status = score >= session.quiz.passMark ? "passed" : "failed";
  progress.submittedAt = new Date();
  progress.quizStartedAt = null;
  await progress.save();

  if (progress.status === "passed") {
    const enrollment = await Enrollment.findOne({
      studentId: auth.id,
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

  return res.status(200).json({ score, passed: progress.status === "passed", progress });
}
