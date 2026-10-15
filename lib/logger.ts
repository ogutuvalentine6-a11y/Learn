import { connectDB } from "./mongodb";
import { Log } from "@/models/Log";

export async function logAction(params: {
  actorId?: string | null;
  action: string;
  target: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await connectDB();
    await Log.create({
      actorId: params.actorId || null,
      action: params.action,
      target: params.target,
      meta: params.meta || {},
    });
  } catch (err) {
    console.error("logAction failed:", err);
  }
}
