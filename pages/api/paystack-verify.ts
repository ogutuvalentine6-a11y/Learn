import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { Enrollment } from "@/models/Enrollment";
import { verifyPayment } from "@/lib/paystack";
import { requireRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = requireRole(req, ["student"]);
  if (!auth) return res.status(403).json({ error: "Forbidden" });

  const { reference } = req.body;
  if (!reference) return res.status(400).json({ error: "reference required" });

  await connectDB();
  const payment = await Payment.findOne({ reference, studentId: auth.id });
  if (!payment) return res.status(404).json({ error: "Payment not found" });

  const result = await verifyPayment(reference);
  if (!result.status || result.data.status !== "success") {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({ error: "Payment not successful" });
  }

  payment.status = "success";
  payment.verifiedAt = new Date();
  await payment.save();

  await Enrollment.findOneAndUpdate(
    { studentId: auth.id, courseId: payment.courseId },
    { paymentStatus: "paid", currentSessionOrder: 1 },
    { upsert: true, new: true }
  );

  return res.status(200).json({ ok: true });
}
