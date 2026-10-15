import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    fetch("/api/course-list").then((r) => r.json()).then(setCourses);
  }, []);

  return (
    <Layout role="student" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Welcome, {user?.fullName || "Student"}</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-2 font-semibold">My Details</h2>
          <p className="text-sm text-gray-600">ID: {user?.idNumber}</p>
          <p className="text-sm text-gray-600">Email: {user?.email}</p>
          <p className="text-sm text-gray-600">School: {user?.school}</p>
          <p className="text-sm text-gray-600">Field: {user?.fieldOfStudy}</p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-2 font-semibold">Finances</h2>
          {payments.length === 0 && <p className="text-sm text-gray-500">No payments yet.</p>}
          {payments.map((p) => (
            <div key={p._id} className="flex justify-between border-b py-1 text-sm">
              <span>{p.courseId}</span>
              <span>NGN {p.amount}</span>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-2 font-semibold">Available Courses</h2>
          <p className="text-sm text-gray-600">{courses.length} courses available</p>
        </div>
      </div>
    </Layout>
  );
}
