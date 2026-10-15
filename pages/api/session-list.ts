import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { courseId } = req.query;
  await connectDB();
  const sessions = await Session.find({ courseId }).sort({ orderIndex: 1 });
  return res.status(200).json(sessions);
}
