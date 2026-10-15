import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { Enrollment } from "@/models/Enrollment";
import { requireRole } from "@/lib/auth";
import { adminVerifyPaymentSchema } from "@/lib/validators";
import { logAction } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["admin"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const parsed = adminVerifyPaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await connectDB();
  const payment = await Payment.findById(parsed.data.paymentId);
  if (!payment) return res.status(404).json({ error: "Not found" });

  payment.status = "success";
  payment.verifiedBy = auth.id as unknown as typeof payment.verifiedBy;
  payment.verifiedAt = new Date();
  await payment.save();

  await Enrollment.findOneAndUpdate(
    { studentId: payment.studentId, courseId: payment.courseId },
    { paymentStatus: "paid", currentSessionOrder: 1 },
    { upsert: true, new: true }
  );

  await logAction({ actorId: auth.id, action: "admin_verify_payment", target: payment._id.toString() });
  return res.status(200).json(payment);
}
