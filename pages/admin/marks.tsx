import { useState } from "react";
import Layout from "@/components/Layout";

export default function AdminMarks() {
  const [progressId, setProgressId] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    const res = await fetch("/api/admin-marks-edit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progressId, score: Number(score) }),
    });
    setMsg(res.ok ? "Saved." : "Failed.");
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Edit Marks</h1>
      <div className="space-y-3 rounded bg-white p-5 shadow">
        <input
          placeholder="Progress ID"
          value={progressId}
          onChange={(e) => setProgressId(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full rounded border px-3 py-2"
        />
        <button onClick={save} className="rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          Save
        </button>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </div>
    </Layout>
  );
}
