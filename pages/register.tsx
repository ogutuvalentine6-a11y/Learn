import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const FIELDS = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "idNumber", label: "ID Number", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "school", label: "School / Institution", type: "text" },
  { name: "fieldOfStudy", label: "Field of Study", type: "text" },
  { name: "courseOfStudy", label: "Course of Study", type: "text" },
  { name: "password", label: "Password", type: "password" },
] as const;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(typeof data.error === "string" ? data.error : "Registration failed");
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Create an account</h1>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name} className={f.name === "password" ? "md:col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium">{f.label}</label>
              <input
                type={f.type}
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ))}
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <button
            disabled={busy}
            className="md:col-span-2 rounded bg-brand-600 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {busy ? "..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="text-brand-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
