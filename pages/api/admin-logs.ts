import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Log } from "@/models/Log";
import { requireRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  await connectDB();
  const logs = await Log.find().sort({ createdAt: -1 }).limit(500);
  return res.status(200).json(logs);
}
