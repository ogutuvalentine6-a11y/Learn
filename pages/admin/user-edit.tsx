import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function AdminUserEdit() {
  const router = useRouter();
  const { userId } = router.query;
  const [role, setRole] = useState("student");
  const [status, setStatus] = useState("active");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch("/api/admin-users")
      .then((r) => r.json())
      .then((users) => {
        const u = users.find((x: any) => x._id === userId);
        if (u) {
          setRole(u.role);
          setStatus(u.status);
        }
      });
  }, [userId]);

  async function save() {
    const res = await fetch("/api/admin-user-update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role, status }),
    });
    setMsg(res.ok ? "Saved." : "Failed.");
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Edit User</h1>
      <div className="space-y-3 rounded bg-white p-5 shadow">
        <label className="block text-sm">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <label className="block text-sm">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <button onClick={save} className="rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          Save
        </button>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </div>
    </Layout>
  );
}
