import mongoose, { Schema, model, models } from "mongoose";
import type { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    idNumber: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    courseOfStudy: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "staff", "admin"], default: "student" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
