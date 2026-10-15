import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function QuizBuilder() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    timerSeconds: 300,
    passMark: 50,
  });
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/session-update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, quiz: form }),
    });
    setMsg(res.ok ? "Quiz saved." : "Failed to save.");
  }

  return (
    <Layout role="staff">
      <h1 className="mb-6 text-2xl font-bold">Quiz Builder</h1>
      <form onSubmit={submit} className="space-y-3 rounded bg-white p-5 shadow">
        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          className="w-full rounded border px-3 py-2"
        />
        {form.options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.correctIndex === i}
              onChange={() => setForm({ ...form, correctIndex: i })}
            />
            <input
              placeholder={`Option ${i + 1}`}
              value={o}
              onChange={(e) => {
                const opts = [...form.options];
                opts[i] = e.target.value;
                setForm({ ...form, options: opts });
              }}
              required
              className="flex-1 rounded border px-3 py-2"
            />
          </div>
        ))}
        <input
          type="number"
          placeholder="Timer (seconds)"
          value={form.timerSeconds}
          onChange={(e) => setForm({ ...form, timerSeconds: Number(e.target.value) })}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Pass mark (%)"
          value={form.passMark}
          onChange={(e) => setForm({ ...form, passMark: Number(e.target.value) })}
          className="w-full rounded border px-3 py-2"
        />
        <button className="rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          Save Quiz
        </button>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </form>
    </Layout>
  );
}
