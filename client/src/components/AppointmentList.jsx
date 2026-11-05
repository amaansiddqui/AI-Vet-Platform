
import { CalendarDays, Clock } from "lucide-react";

export default function AppointmentList({ appointments, loading, error }) {
  return (
    <section
      aria-labelledby="upcoming-appointments-heading"
      aria-busy={loading}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 id="upcoming-appointments-heading" className="font-bold text-slate-900">
          Upcoming Appointments
        </h2>
        <span aria-live="polite" className="text-xs font-medium text-blue-700">
          {loading ? "Loading" : error ? "Unavailable" : `${appointments.length} upcoming`}
        </span>
      </div>

      {appointments.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {appointments.map((item) => {
            const date = new Date(item.scheduledAt);

            return (
              <li
                key={item._id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div aria-hidden="true" className="rounded-xl bg-blue-50 p-3 text-blue-700">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.pet?.name || "Pet"}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {item.reason || "Veterinary appointment"}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 sm:text-right">
                  <p className="flex items-center gap-1 sm:justify-end">
                    <CalendarDays size={13} aria-hidden="true" />
                    <span className="sr-only">Date: </span>
                    <time dateTime={date.toISOString()}>
                      {date.toLocaleDateString()}
                    </time>
                  </p>
                  <p className="mt-1 flex items-center gap-1 sm:justify-end">
                    <Clock size={13} aria-hidden="true" />
                    <span className="sr-only">Time: </span>
                    <time dateTime={date.toISOString()}>
                      {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </time>
                  </p>
                  {item.vetName && (
                    <p className="mt-1">Veterinarian: {item.vetName}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          className="p-5 text-sm text-slate-600"
          role={loading ? "status" : error ? "alert" : undefined}
        >
          {loading
            ? "Loading appointments…"
            : error
              ? "Appointments could not be loaded."
              : "No upcoming appointments."}
        </p>
      )}
    </section>
  );
}
