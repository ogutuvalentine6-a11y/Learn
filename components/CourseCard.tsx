interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  onSelect?: (id: string) => void;
  ctaLabel?: string;
}

export default function CourseCard({
  id,
  title,
  description,
  price,
  onSelect,
  ctaLabel = "Enroll",
}: CourseCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-brand-600">NGN {price.toLocaleString()}</span>
        {onSelect && (
          <button
            onClick={() => onSelect(id)}
            className="rounded bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
