import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const registerSchema = z.object({
  fullName: z.string().min(2),
  idNumber: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(7),
  location: z.string().min(2),
  school: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  courseOfStudy: z.string().min(2),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const courseCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().nonnegative(),
});

export const sessionCreateSchema = z.object({
  courseId: z.string(),
  orderIndex: z.number().int().positive(),
  title: z.string().min(2),
  notes: z.string().default(""),
  materialUrls: z.array(z.string().url()).default([]),
  quiz: z
    .object({
      question: z.string(),
      options: z.array(z.string()).min(2),
      correctIndex: z.number().int().nonnegative(),
      timerSeconds: z.number().int().positive(),
      passMark: z.number().min(0).max(100),
    })
    .nullable()
    .default(null),
});

export const quizSubmitSchema = z.object({
  sessionId: z.string(),
  selectedIndex: z.number().int().nonnegative(),
});

export const submissionReviewSchema = z.object({
  progressId: z.string(),
  approve: z.boolean(),
  note: z.string().default(""),
});

export const uploadStudentFileSchema = z.object({
  sessionId: z.string(),
  fileUrl: z.string().url(),
});

export const paystackInitSchema = z.object({
  courseId: z.string(),
});

export const adminUserUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(["student", "staff", "admin"]).optional(),
  status: z.enum(["active", "blocked"]).optional(),
});

export const adminAssignStaffSchema = z.object({
  staffId: z.string(),
  courseId: z.string(),
});

export const adminVerifyPaymentSchema = z.object({
  paymentId: z.string(),
});

export const adminMarksEditSchema = z.object({
  progressId: z.string(),
  score: z.number().min(0).max(100),
});
