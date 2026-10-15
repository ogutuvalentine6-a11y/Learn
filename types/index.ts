import type { Types } from "mongoose";

export type Role = "student" | "staff" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  idNumber: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  school: string;
  fieldOfStudy: string;
  courseOfStudy: string;
  password: string;
  role: Role;
  status: "active" | "blocked";
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

export interface ISession {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  orderIndex: number;
  title: string;
  notes: string;
  materialUrls: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    timerSeconds: number;
    passMark: number;
  } | null;
  createdAt: Date;
}

export interface IEnrollment {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  paymentStatus: "pending" | "paid" | "failed";
  currentSessionOrder: number;
  completedAt: Date | null;
  createdAt: Date;
}

export interface IProgress {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  sessionId: Types.ObjectId;
  status: "locked" | "unlocked" | "in_progress" | "passed" | "failed" | "awaiting_review";
  score: number | null;
  uploadUrl: string | null;
  quizStartedAt: Date | null;
  submittedAt: Date | null;
  reviewedBy: Types.ObjectId | null;
  reviewNote: string | null;
}

export interface IPayment {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  amount: number;
  reference: string;
  status: "pending" | "success" | "failed";
  verifiedBy: Types.ObjectId | null;
  verifiedAt: Date | null;
  createdAt: Date;
}

export interface ICertificate {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  certificateId: string;
  issuedAt: Date;
  emailSent: boolean;
}

export interface IStaffAssignment {
  _id: Types.ObjectId;
  staffId: Types.ObjectId;
  courseId: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
}

export interface ILog {
  _id: Types.ObjectId;
  actorId: Types.ObjectId | null;
  action: string;
  target: string;
  meta: Record<string, unknown>;
  createdAt: Date;
}

declare module "next" {
  interface NextApiRequest {
    user?: { id: string; role: Role };
  }
}
