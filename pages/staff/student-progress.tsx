import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";

export default function StaffStudentProgress() {
  const [user, setUser] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
  }, []);

  return (
    <Layout role="staff" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Student Progress</h1>
      <div className="rounded bg-white p-5 shadow">
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">No student activity yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Student</th>
                <th>Course</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="py-2">{r.studentName}</td>
                  <td>{r.courseTitle}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.score ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
