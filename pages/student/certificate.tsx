import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function StudentCertificate() {
  const [user, setUser] = useState<any>(null);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
  }, []);

  return (
    <Layout role="student" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">My Certificates</h1>
      {certs.length === 0 ? (
        <p className="text-sm text-gray-500">No certificates yet. Complete a course to earn one.</p>
      ) : (
        <ul className="space-y-3">
          {certs.map((c) => (
            <li key={c._id} className="rounded bg-white p-4 shadow">
              <p className="font-semibold">{c.courseTitle}</p>
              <p className="text-sm text-gray-600">ID: {c.certificateId}</p>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
