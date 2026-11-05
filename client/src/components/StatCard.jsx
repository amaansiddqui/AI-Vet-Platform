
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color
}) {
  return (
    <article
      aria-labelledby={`stat-${title.toLowerCase().replaceAll(" ", "-")}`}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2
          id={`stat-${title.toLowerCase().replaceAll(" ", "-")}`}
          className="text-sm font-medium text-slate-600"
        >
          {title}
        </h2>

        <div aria-hidden="true" className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} aria-hidden="true" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
    </article>
  );
}
