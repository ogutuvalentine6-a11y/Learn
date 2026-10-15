import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import PaymentButton from "@/components/PaymentButton";

export default function StudentCourses() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    fetch("/api/course-list").then((r) => r.json()).then(setCourses);

    const ref = router.query.ref as string;
    if (ref) {
      fetch("/api/paystack-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref }),
      });
    }
  }, [router.query.ref]);

  return (
    <Layout role="student" name={user?.fullName}>
      <h1 className="mb-6 text-2xl font-bold">Courses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            id={c._id}
            title={c.title}
            description={c.description}
            price={c.price}
            onSelect={() => setSelected(c)}
            ctaLabel="Select"
          />
        ))}
      </div>

      {selected && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">{selected.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{selected.description}</p>
          <p className="mt-2 font-bold text-brand-600">NGN {selected.price.toLocaleString()}</p>
          <div className="mt-4">
            <PaymentButton courseId={selected._id} />
          </div>
        </div>
      )}
    </Layout>
  );
}
