
import { useState } from "react";
import {
  AiPageShell,
  ProviderSelect,
  ReplyBox,
  useAiEndpoint,
} from "../components/aiShared";
import { api } from "../lib/api";
import { useEffect } from "react";

export default function MedicalHistory() {
  const [provider, setProvider] = useState("openrouter");
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [records, setRecords] = useState([]);

  const summary = useAiEndpoint("/api/ai/assistant/history-summary");

  useEffect(() => {
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => { });
  }, []);

  useEffect(() => {
    if (!petId) {
      setRecords([]);
      return;
    }
    api
      .get(`/api/ai/records?pet=${petId}`)
      .then((d) => setRecords(d.records))
      .catch(() => { });
  }, [petId]);

  return (
    <AiPageShell
      title="Medical History"
      description="Your pet's records plus an easy-to-read AI summary."
    >
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
        >
          <option value="">Select a pet</option>
          {pets.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.species})
            </option>
          ))}
        </select>

        <ProviderSelect value={provider} onChange={setProvider} />

        <button
          onClick={() => summary.run({ petId, provider })}
          disabled={!petId || summary.loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {summary.loading ? "Summarizing…" : "Generate AI summary"}
        </button>
      </div>

      <ReplyBox {...summary} />

      {records.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Records</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {records.map((r) => (
              <li key={r._id} className="py-3">
                <p className="font-medium text-slate-800">
                  {new Date(r.visitDate).toLocaleDateString()} —{" "}
                  {r.diagnosis || "Visit"}
                </p>
                <p className="text-slate-500">
                  {[r.treatment, r.prescription, r.notes]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AiPageShell>
  );
}
