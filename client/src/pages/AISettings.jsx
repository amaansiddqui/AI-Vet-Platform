
import { useState } from "react";
import {
  AiPageShell,
  ProviderSelect,
  ReplyBox,
  useAiEndpoint,
} from "../components/aiShared";
import { api } from "../lib/api";
import { useEffect } from "react";

export default function AISettings() {
  const [provider, setProvider] = useState("openrouter");
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [status, setStatus] = useState(null);

  const nutrition = useAiEndpoint("/api/ai/assistant/nutrition");

  useEffect(() => {
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => {});
    api.get("/api/ai/providers").then(setStatus).catch(() => {});
  }, []);

  const generate = () => {
    if (!petId) return;
    nutrition.run({ petId, provider });
  };

  return (
    <AiPageShell
      title="AI Nutrition Assistant"
      description="General feeding guidance based on your pet's profile."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">
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
            onClick={generate}
            disabled={!petId || nutrition.loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {nutrition.loading ? "Generating…" : "Get nutrition guidance"}
          </button>
        </div>

        {status && (
          <p className="mt-4 text-xs text-slate-400">
            OpenRouter configured: {status.openrouter ? "yes" : "no"} · NVIDIA
            configured: {status.nvidia ? "yes" : "no"}
          </p>
        )}
      </div>

      <ReplyBox {...nutrition} />
    </AiPageShell>
  );
}
