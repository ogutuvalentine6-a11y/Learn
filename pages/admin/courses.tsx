import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", price: 0 });
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const data = await fetch("/api/course-list").then((r) => r.json());
    setCourses(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/course-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setMsg(res.ok ? "Course created." : "Failed.");
    setForm({ title: "", description: "", price: 0 });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Deactivate this course?")) return;
    await fetch("/api/course-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: id }),
    });
    load();
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Courses</h1>

      <form onSubmit={create} className="mb-8 space-y-3 rounded bg-white p-5 shadow">
        <h2 className="font-semibold">Create Course</h2>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price (NGN)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
          className="w-full rounded border px-3 py-2"
        />
        <button className="rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          Create
        </button>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </form>

      <div className="rounded bg-white p-5 shadow">
        <h2 className="mb-3 font-semibold">Existing Courses</h2>
        <ul className="space-y-2">
          {courses.map((c) => (
            <li key={c._id} className="flex justify-between border-b py-2 text-sm">
              <span>{c.title} — NGN {c.price.toLocaleString()}</span>
              <button onClick={() => remove(c._id)} className="text-red-600 underline">
                Deactivate
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
