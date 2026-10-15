import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";

export default function StaffCourseManage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", orderIndex: 1, notes: "" });
  const [materialUrls, setMaterialUrls] = useState<string[]>([]);

  async function load() {
    if (!courseId) return;
    const data = await fetch(`/api/session-list?courseId=${courseId}`).then((r) => r.json());
    setSessions(data);
  }

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    load();
  }, [courseId]);

  async function createSession(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/session-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        orderIndex: Number(form.orderIndex),
        title: form.title,
        notes: form.notes,
        materialUrls,
        quiz: null,
      }),
    });
    setForm({ title: "", orderIndex: sessions.length + 2, notes: "" });
    setMaterialUrls([]);
    load();
  }

  return (
    <Layout role="staff" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Manage Course</h1>

      <form onSubmit={createSession} className="mb-8 rounded bg-white p-5 shadow">
        <h2 className="mb-3 font-semibold">Add Session</h2>
        <input
          placeholder="Session title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="mb-3 w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Order"
          value={form.orderIndex}
          onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })}
          required
          className="mb-3 w-full rounded border px-3 py-2"
        />
        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={4}
          className="mb-3 w-full rounded border px-3 py-2"
        />
        <FileUploader
          signatureUrl={`/api/upload-material?courseId=${courseId}&sessionId=new`}
          onUploaded={(url) => setMaterialUrls((u) => [...u, url])}
          label="Attach material"
        />
        {materialUrls.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-xs text-gray-600">
            {materialUrls.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        )}
        <button className="mt-4 rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          Create Session
        </button>
      </form>

      <div className="rounded bg-white p-5 shadow">
        <h2 className="mb-3 font-semibold">Existing Sessions</h2>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s._id} className="flex justify-between border-b py-2 text-sm">
              <span>#{s.orderIndex} {s.title}</span>
              <a href={`/staff/quiz-builder?sessionId=${s._id}`} className="text-brand-600 underline">
                Add Quiz
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
