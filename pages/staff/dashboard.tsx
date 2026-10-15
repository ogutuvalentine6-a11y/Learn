import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function StaffDashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    fetch("/api/course-list").then((r) => r.json()).then(setCourses);
  }, []);

  return (
    <Layout role="staff" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Staff Dashboard</h1>
      <div className="rounded bg-white p-5 shadow">
        <h2 className="mb-3 font-semibold">Assigned Courses</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {courses.map((c) => (
              <li key={c._id} className="flex justify-between border-b py-2 text-sm">
                <span>{c.title}</span>
                <a href={`/staff/course-manage?courseId=${c._id}`} className="text-brand-600 underline">
                  Manage
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
