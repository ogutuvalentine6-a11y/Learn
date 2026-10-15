import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  async function load() {
    const data = await fetch("/api/admin-users").then((r) => r.json());
    setUsers(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function toggle(user: any) {
    await fetch("/api/admin-user-update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        status: user.status === "active" ? "blocked" : "active",
      }),
    });
    load();
  }

  async function remove(user: any) {
    if (!confirm(`Delete ${user.email}?`)) return;
    await fetch("/api/admin-user-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    });
    load();
  }

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">All Users</h1>
      <div className="rounded bg-white p-5 shadow">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="py-2">{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td><StatusBadge status={u.status} /></td>
                <td className="space-x-2 py-2">
                  <button onClick={() => toggle(u)} className="text-brand-600 underline">
                    {u.status === "active" ? "Block" : "Activate"}
                  </button>
                  <button onClick={() => router.push(`/admin/user-edit?userId=${u._id}`)} className="text-brand-600 underline">
                    Edit
                  </button>
                  <button onClick={() => remove(u)} className="text-red-600 underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
