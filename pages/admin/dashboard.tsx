import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    fetch("/api/admin-users").then((r) => r.json()).then((d) => Array.isArray(d) && setUsers(d));
    fetch("/api/course-list").then((r) => r.json()).then(setCourses);
  }, []);

  return (
    <Layout role="admin" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="rounded bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Active Courses</p>
          <p className="text-3xl font-bold">{courses.length}</p>
        </div>
        <div className="rounded bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Staff</p>
          <p className="text-3xl font-bold">{users.filter((u) => u.role === "staff").length}</p>
        </div>
      </div>
    </Layout>
  );
}
