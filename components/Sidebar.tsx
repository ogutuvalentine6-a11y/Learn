import Link from "next/link";
import { useRouter } from "next/router";

interface Item {
  label: string;
  href: string;
}

const NAV: Record<string, Item[]> = {
  student: [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "Courses", href: "/student/courses" },
    { label: "Certificate", href: "/student/certificate" },
  ],
  staff: [
    { label: "Dashboard", href: "/staff/dashboard" },
    { label: "Course Manage", href: "/staff/course-manage" },
    { label: "Quiz Builder", href: "/staff/quiz-builder" },
    { label: "Student Progress", href: "/staff/student-progress" },
    { label: "Review Submissions", href: "/staff/review-submission" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Courses", href: "/admin/courses" },
    { label: "Assign Staff", href: "/admin/assign-staff" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Marks", href: "/admin/marks" },
    { label: "Logs", href: "/admin/logs" },
  ],
};

export default function Sidebar({ role }: { role: "student" | "staff" | "admin" }) {
  const router = useRouter();
  const items = NAV[role] || [];

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-gray-50 md:block">
      <nav className="flex flex-col gap-1 p-3">
        {items.map((it) => {
          const active = router.pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`rounded px-3 py-2 text-sm ${
                active ? "bg-brand-600 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
