import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
  return res.status(200).json(courses);
}
