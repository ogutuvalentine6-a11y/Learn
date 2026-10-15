import { Schema, model, models } from "mongoose";
import type { ICertificate } from "@/types";

const CertificateSchema = new Schema<ICertificate>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    certificateId: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Certificate =
  models.Certificate || model<ICertificate>("Certificate", CertificateSchema);
