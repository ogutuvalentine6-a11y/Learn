import { Schema, model, models } from "mongoose";
import type { IProgress } from "@/types";

const ProgressSchema = new Schema<IProgress>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    status: {
      type: String,
      enum: ["locked", "unlocked", "in_progress", "passed", "failed", "awaiting_review"],
      default: "locked",
    },
    score: { type: Number, default: null },
    uploadUrl: { type: String, default: null },
    quizStartedAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewNote: { type: String, default: null },
  },
  { timestamps: true }
);

ProgressSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

export const Progress = models.Progress || model<IProgress>("Progress", ProgressSchema);
