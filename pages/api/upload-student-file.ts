import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Progress } from "@/models/Progress";
import { Session } from "@/models/Session";
import { requireRole } from "@/lib/auth";
import { uploadStudentFileSchema } from "@/lib/validators";
import { generateUploadSignature } from "@/lib/cloudinary";
import { enforceRateLimit, uploadLimiter } from "@/lib/rate-limit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireRole(req, ["student"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const ok = await enforceRateLimit(uploadLimiter, req);
  if (!ok) return res.status(429).json({ error: "Too many uploads" });

  if (req.method === "GET") {
    const { sessionId } = req.query;
    const folder = `learning-platform/submissions/${auth.id}/${sessionId}`;
    const sig = generateUploadSignature({ folder });
    return res.status(200).json({ ...sig, folder, apiKey: process.env.CLOUDINARY_API_KEY });
  }

  if (req.method === "POST") {
    const parsed = uploadStudentFileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    await connectDB();
    const session = await Session.findById(parsed.data.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const progress = await Progress.findOneAndUpdate(
      { studentId: auth.id, sessionId: session._id },
      {
        studentId: auth.id,
        courseId: session.courseId,
        sessionId: session._id,
        uploadUrl: parsed.data.fileUrl,
        status: "awaiting_review",
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    return res.status(200).json(progress);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
