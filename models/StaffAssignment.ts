import { Schema, model, models } from "mongoose";
import type { IStaffAssignment } from "@/types";

const StaffAssignmentSchema = new Schema<IStaffAssignment>(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

StaffAssignmentSchema.index({ staffId: 1, courseId: 1 }, { unique: true });

export const StaffAssignment =
  models.StaffAssignment || model<IStaffAssignment>("StaffAssignment", StaffAssignmentSchema);
