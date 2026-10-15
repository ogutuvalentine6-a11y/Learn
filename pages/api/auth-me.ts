import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = getAuthUser(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();
  const user = await User.findById(auth.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(200).json(user);
}
