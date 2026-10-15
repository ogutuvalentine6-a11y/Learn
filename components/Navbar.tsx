import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface NavbarProps {
  role?: "student" | "staff" | "admin" | null;
  name?: string;
}

export default function Navbar({ role, name }: NavbarProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth-logout", { method: "POST" });
    router.push("/login");
  }

  const home =
    role === "admin" ? "/admin/dashboard"
    : role === "staff" ? "/staff/dashboard"
    : role === "student" ? "/student/dashboard"
    : "/";

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={home} className="text-lg font-bold text-brand-600">
          Learning Platform
        </Link>
        <div className="flex items-center gap-4">
          {name && <span className="text-sm text-gray-600">{name}</span>}
          {role && (
            <button
              onClick={logout}
              disabled={busy}
              className="rounded bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? "..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
