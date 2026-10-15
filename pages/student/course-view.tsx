import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import SessionStepper from "@/components/SessionStepper";

export default function CourseView() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    if (courseId) {
      fetch(`/api/session-list?courseId=${courseId}`)
        .then((r) => r.json())
        .then((data) =>
          setSessions(
            data.map((s: any, i: number) => ({
              order: s.orderIndex,
              title: s.title,
              status: i === 0 ? "unlocked" : "locked",
            }))
          )
        );
    }
  }, [courseId]);

  return (
    <Layout role="student" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Course Journey</h1>
      <SessionStepper
        steps={sessions}
        onSelect={(order) => {
          const s = sessions.find((x) => x.order === order);
          router.push(`/student/session?courseId=${courseId}&order=${s?.order}`);
        }}
      />
      <p className="mt-6 text-sm text-gray-500">
        Complete each session in order. You cannot skip ahead until the current session is passed.
      </p>
      <Link href="/student/courses" className="mt-4 inline-block text-brand-600 underline">
        Back to courses
      </Link>
    </Layout>
  );
}
