const COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
  passed: "bg-green-100 text-green-700",
  awaiting_review: "bg-purple-100 text-purple-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  locked: "bg-gray-200 text-gray-600",
  unlocked: "bg-blue-100 text-blue-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = COLORS[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium uppercase ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}
