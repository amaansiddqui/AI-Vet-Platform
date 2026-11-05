
import { CalendarDays, PawPrint } from "lucide-react";

export default function PetCard({ pet, nextVisit }) {
  const parsedNextVisit = nextVisit ? new Date(nextVisit) : null;
  const validNextVisit = parsedNextVisit && !Number.isNaN(parsedNextVisit.getTime());

  return (
    <article
      aria-labelledby={`pet-${pet._id}-name`}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 p-5">
        <div aria-hidden="true" className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <PawPrint size={22} />
        </div>
        <div>
          <h3 id={`pet-${pet._id}-name`} className="text-lg font-bold text-slate-900">
            {pet.name}
          </h3>
          <p className="text-sm capitalize text-slate-600">
            {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 px-5 py-4 text-sm">
        {pet.age != null && (
          <div>
            <dt className="text-xs text-slate-600">Age</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {pet.age} {pet.age === 1 ? "year" : "years"}
            </dd>
          </div>
        )}
        {pet.weightKg != null && (
          <div>
            <dt className="text-xs text-slate-600">Weight</dt>
            <dd className="mt-1 font-medium text-slate-900">{pet.weightKg} kg</dd>
          </div>
        )}
        {validNextVisit && (
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-xs text-slate-600">
              <CalendarDays size={14} aria-hidden="true" />
              Next visit
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              <time dateTime={parsedNextVisit.toISOString()}>
                {parsedNextVisit.toLocaleDateString()}
              </time>
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
