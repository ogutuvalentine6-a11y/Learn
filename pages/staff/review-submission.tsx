import { useState } from "react";
import Layout from "@/components/Layout";

export default function ReviewSubmission() {
  const [progressId, setProgressId] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function review(approve: boolean) {
    const res = await fetch("/api/submission-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progressId, approve, note }),
    });
    setMsg(res.ok ? "Reviewed." : "Failed.");
  }

  return (
    <Layout role="staff">
      <h1 className="mb-6 text-2xl font-bold">Review Submission</h1>
      <div className="space-y-3 rounded bg-white p-5 shadow">
        <input
          placeholder="Progress ID"
          value={progressId}
          onChange={(e) => setProgressId(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          placeholder="Review note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
        <div className="flex gap-3">
          <button
            onClick={() => review(true)}
            className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => review(false)}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Decline
          </button>
        </div>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </div>
    </Layout>
  );
}
