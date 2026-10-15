import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import QuizTimer from "@/components/QuizTimer";
import FileUploader from "@/components/FileUploader";

export default function StudentSession() {
  const router = useRouter();
  const { courseId, order } = router.query;
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth-me").then((r) => r.json()).then(setUser);
    if (courseId) {
      fetch(`/api/session-list?courseId=${courseId}`)
        .then((r) => r.json())
        .then((list) => {
          const s = list.find((x: any) => x.orderIndex === Number(order));
          setSession(s);
          if (s) {
            fetch("/api/session-progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: s._id }),
            });
          }
        });
    }
  }, [courseId, order]);

  async function submitQuiz() {
    if (answer === null || !session) return;
    const res = await fetch("/api/quiz-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session._id, selectedIndex: answer }),
    });
    const data = await res.json();
    if (data.passed) {
      setFeedback("Passed! Moving on...");
      setTimeout(() => router.push(`/student/course-view?courseId=${courseId}`), 1500);
    } else {
      setFeedback(data.reason === "timeout" ? "Time up. Retake required." : "Failed. Try again.");
    }
  }

  if (!session) return <Layout role="student" name={user?.fullName}><p>Loading...</p></Layout>;

  return (
    <Layout role="student" name={user?.fullName}>
      <h1 className="mb-2 text-2xl font-bold">
        Session #{session.orderIndex}: {session.title}
      </h1>

      {session.notes && (
        <div className="mb-6 rounded bg-white p-5 shadow">
          <h2 className="mb-2 font-semibold">Notes</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{session.notes}</p>
        </div>
      )}

      {session.materialUrls?.length > 0 && (
        <div className="mb-6 rounded bg-white p-5 shadow">
          <h2 className="mb-2 font-semibold">Materials</h2>
          <ul className="list-disc pl-5 text-sm text-brand-600">
            {session.materialUrls.map((u: string, i: number) => (
              <li key={i}>
                <a href={u} target="_blank" rel="noreferrer" className="underline">
                  Download material {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 rounded bg-white p-5 shadow">
        <h2 className="mb-2 font-semibold">Submit Work</h2>
        <FileUploader
          signatureUrl={`/api/upload-student-file?sessionId=${session._id}`}
          onUploaded={async (url) => {
            await fetch("/api/upload-student-file", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: session._id, fileUrl: url }),
            });
            setFeedback("Uploaded. Awaiting staff review.");
          }}
          label="Upload submission"
        />
      </div>

      {session.quiz && (
        <div className="rounded bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Quiz</h2>
            <QuizTimer seconds={session.quiz.timerSeconds} onExpire={submitQuiz} />
          </div>
          <p className="mb-3 text-sm">{session.quiz.question}</p>
          <div className="space-y-2">
            {session.quiz.options.map((opt: string, i: number) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="quiz"
                  checked={answer === i}
                  onChange={() => setAnswer(i)}
                />
                {opt}
              </label>
            ))}
          </div>
          <button
            onClick={submitQuiz}
            disabled={answer === null}
            className="mt-4 rounded bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}

      {feedback && <p className="mt-4 text-sm font-medium text-gray-800">{feedback}</p>}
    </Layout>
  );
}
