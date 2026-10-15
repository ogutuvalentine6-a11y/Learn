import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { Payment } from "@/models/Payment";
import { Enrollment } from "@/models/Enrollment";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth";
import { initializePayment } from "@/lib/paystack";
import { paystackInitSchema } from "@/lib/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["student"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = paystackInitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const [course, user] = await Promise.all([
    Course.findById(parsed.data.courseId),
    User.findById(auth.id),
  ]);
  if (!course || !user) return res.status(404).json({ error: "Not found" });

  const reference = `LP-${Date.now()}-${auth.id.slice(-6)}`;
  const amountKobo = course.price * 100;

  const init = await initializePayment({
    email: user.email,
    amount: amountKobo,
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/courses?ref=${reference}`,
    metadata: { courseId: course._id.toString(), studentId: auth.id },
  });

  await Payment.create({
    studentId: auth.id,
    courseId: course._id,
    amount: course.price,
    reference,
    status: "pending",
  });

  await Enrollment.findOneAndUpdate(
    { studentId: auth.id, courseId: course._id },
    { studentId: auth.id, courseId: course._id, paymentStatus: "pending" },
    { upsert: true, new: true }
  );

  return res.status(200).json({ authorization_url: init.data.authorization_url, reference });
}
