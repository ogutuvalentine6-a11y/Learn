import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";
import { enforceRateLimit, uploadLimiter } from "@/lib/rate-limit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["staff", "admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const ok = await enforceRateLimit(uploadLimiter, req);
  if (!ok) return res.status(429).json({ error: "Too many uploads" });

  const { courseId, sessionId } = req.body;
  const folder = `learning-platform/materials/${courseId}/${sessionId}`;
  const sig = generateUploadSignature({ folder });
  return res.status(200).json({ ...sig, folder, apiKey: process.env.CLOUDINARY_API_KEY });
}
