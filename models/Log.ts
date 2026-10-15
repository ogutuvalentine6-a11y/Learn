import { Schema, model, models } from "mongoose";
import type { ILog } from "@/types";

const LogSchema = new Schema<ILog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true },
    target: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Log = models.Log || model<ILog>("Log", LogSchema);
