import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";

export default function AdminPayments() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin-logs")
      .then((r) => r.json())
      .then(() => setRows([]))
      .catch(() => setRows([]));
  }, []);

  async function verify(id: string) {
    const res = await fetch("/api/admin-verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: id }),
    });
    setMsg(res.ok ? "Verified." : "Failed.");
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Payments</h1>
      <div className="rounded bg-white p-5 shadow">
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">No pending payments.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2">{p.studentId}</td>
                  <td>{p.courseId}</td>
                  <td>NGN {p.amount}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    {p.status !== "success" && (
                      <button onClick={() => verify(p._id)} className="text-brand-600 underline">
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
      </div>
    </Layout>
  );
}
