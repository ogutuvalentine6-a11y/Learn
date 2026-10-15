import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin-logs").then((r) => r.json()).then((d) => Array.isArray(d) && setLogs(d));
  }, []);

  return (
    <Layout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Activity Logs</h1>
      <div className="rounded bg-white p-5 shadow">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="py-2">{new Date(l.createdAt).toLocaleString()}</td>
                <td>{l.actorId || "-"}</td>
                <td>{l.action}</td>
                <td>{l.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
