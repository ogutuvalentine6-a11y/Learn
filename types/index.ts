export type Role = "student" | "staff" | "admin";

export interface IUser {
  _id: string;
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
  _id: string;
  title: string;
  description: string;
  price: number;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ISession {
  _id: string;
  courseId: string;
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
  _id: string;
  studentId: string;
  courseId: string;
  paymentStatus: "pending" | "paid" | "failed";
  currentSessionOrder: number;
  completedAt: Date | null;
  createdAt: Date;
}

export interface IProgress {
  _id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  status: "locked" | "unlocked" | "in_progress" | "passed" | "failed" | "awaiting_review";
  score: number | null;
  uploadUrl: string | null;
  quizStartedAt: Date | null;
  submittedAt: Date | null;
  reviewedBy: string | null;
  reviewNote: string | null;
}

export interface IPayment {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  reference: string;
  status: "pending" | "success" | "failed";
  verifiedBy: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
}

export interface ICertificate {
  _id: string;
  studentId: string;
  courseId: string;
  certificateId: string;
  issuedAt: Date;
  emailSent: boolean;
}

export interface IStaffAssignment {
  _id: string;
  staffId: string;
  courseId: string;
  assignedBy: string;
  assignedAt: Date;
}

export interface ILog {
  _id: string;
  actorId: string | null;
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
