import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Learn. Track. Get Certified.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A role-based learning platform for students, staff, and admins.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded bg-brand-600 px-5 py-2.5 text-white hover:bg-brand-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded border border-brand-600 px-5 py-2.5 text-brand-600 hover:bg-brand-50"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
