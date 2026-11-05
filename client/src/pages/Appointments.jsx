
import { useState } from "react";
import {
  AiPageShell,
  ProviderSelect,
  ReplyBox,
  useAiEndpoint,
} from "../components/aiShared";
import { api } from "../lib/api";
import { useEffect } from "react";

export default function Appointments() {
  const [provider, setProvider] = useState("openrouter");
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [concern, setConcern] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [booked, setBooked] = useState(false);

  const advisor = useAiEndpoint("/api/ai/assistant/appointment");

  const loadAppointments = () =>
    api.get("/api/ai/appointments").then((d) => setAppointments(d.appointments)).catch(() => { });

  useEffect(() => {
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => { });
    loadAppointments();
  }, []);

  const askAi = (e) => {
    e.preventDefault();
    if (!concern.trim()) return;
    advisor.run({ concern, provider, ...(petId ? { petId } : {}) });
  };

  const book = async (e) => {
    e.preventDefault();
    if (!petId || !scheduledAt) return;
    try {
      await api.post("/api/ai/appointments", { pet: petId, scheduledAt, reason });
      setBooked(true);
      setScheduledAt("");
      setReason("");
      loadAppointments();
    } catch {
      setBooked(false);
    }
  };

  return (
    <AiPageShell
      title="Appointments"
      description="Ask the AI whether you need a vet visit, then book it."
    >
      <form
        onSubmit={askAi}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          >
            <option value="">No specific pet</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>

          <ProviderSelect value={provider} onChange={setProvider} />
        </div>

        <textarea
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          rows={3}
          placeholder="e.g. My cat has been limping for two days"
          className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400"
        />

        <button
          type="submit"
          disabled={advisor.loading || !concern.trim()}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {advisor.loading ? "Thinking…" : "Do I need an appointment?"}
        </button>
      </form>

      <ReplyBox {...advisor} />

      <form
        onSubmit={book}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h2 className="font-semibold text-slate-900">Book an appointment</h2>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          >
            <option value="">Select pet</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          />

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="min-w-48 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          />

          <button
            type="submit"
            disabled={!petId || !scheduledAt}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Book
          </button>
        </div>

        {booked && (
          <p className="text-sm text-green-600">Appointment booked ✓</p>
        )}
      </form>

      {appointments.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-900">
            Upcoming appointments
          </h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {appointments.map((a) => (
              <li key={a._id} className="flex justify-between py-2">
                <span>
                  {a.pet?.name || "Pet"} · {a.reason || a.status}
                </span>
                <span className="text-slate-500">
                  {new Date(a.scheduledAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AiPageShell>
  );
}
