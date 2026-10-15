import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AdminAssignStaff() {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [staffId, setStaffId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin-users").then((r) => r.json()).then((d) => Array.isArray(d) && setUsers(d));
    fetch("/api/course-list").then((r) => r.json()).then(setCourses);
  }, []);

  async function assign() {
    const res = await fetch("/api/admin-assign-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, courseId }),
    });
    setMsg(res.ok ? "Assigned." : "Failed.");
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Assign Staff to Course</h1>
      <div className="space-y-3 rounded bg-white p-5 shadow">
        <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
          ))}
        </select>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <button
          onClick={assign}
          disabled={!staffId || !courseId}
          className="rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
        >
          Assign
        </button>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </div>
    </Layout>
  );
}
