import { Schema, model, models } from "mongoose";
import type { ISession } from "@/types";

const QuizSchema = new Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    timerSeconds: { type: Number, required: true, default: 300 },
    passMark: { type: Number, required: true, default: 50 },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    orderIndex: { type: Number, required: true },
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    materialUrls: { type: [String], default: [] },
    quiz: { type: QuizSchema, default: null },
  },
  { timestamps: true }
);

SessionSchema.index({ courseId: 1, orderIndex: 1 }, { unique: true });

export const Session = models.Session || model<ISession>("Session", SessionSchema);
