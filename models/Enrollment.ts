import { Schema, model, models } from "mongoose";
import type { IEnrollment } from "@/types";

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    currentSessionOrder: { type: Number, default: 1 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const Enrollment = models.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);
