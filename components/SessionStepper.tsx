interface Step {
  order: number;
  title: string;
  status: "locked" | "unlocked" | "in_progress" | "passed" | "failed" | "awaiting_review";
}

const COLORS: Record<Step["status"], string> = {
  locked: "bg-gray-200 text-gray-500",
  unlocked: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  passed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  awaiting_review: "bg-purple-100 text-purple-700",
};

export default function SessionStepper({
  steps,
  onSelect,
}: {
  steps: Step[];
  onSelect: (order: number) => void;
}) {
  return (
    <ol className="space-y-2">
      {steps.map((s) => {
        const disabled = s.status === "locked";
        return (
          <li key={s.order}>
            <button
              disabled={disabled}
              onClick={() => onSelect(s.order)}
              className={`flex w-full items-center justify-between rounded px-4 py-3 text-left text-sm ${COLORS[s.status]} disabled:cursor-not-allowed`}
            >
              <span>
                <strong className="mr-2">#{s.order}</strong>
                {s.title}
              </span>
              <span className="text-xs uppercase">{s.status.replace("_", " ")}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
