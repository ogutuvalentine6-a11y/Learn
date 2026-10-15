import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { Enrollment } from "@/models/Enrollment";

export const config = { api: { bodyParser: false } };

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const raw = await readRawBody(req);
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(raw)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(raw.toString());
  if (event.event !== "charge.success") return res.status(200).json({ ok: true });

  const { reference, metadata } = event.data;
  await connectDB();

  const payment = await Payment.findOne({ reference });
  if (!payment || payment.status === "success") return res.status(200).json({ ok: true });

  payment.status = "success";
  payment.verifiedAt = new Date();
  await payment.save();

  await Enrollment.findOneAndUpdate(
    { studentId: metadata.studentId, courseId: metadata.courseId },
    { paymentStatus: "paid", currentSessionOrder: 1 },
    { upsert: true, new: true }
  );

  return res.status(200).json({ ok: true });
}
