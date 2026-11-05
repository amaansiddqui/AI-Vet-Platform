
import { useState } from "react";
import {
  AiPageShell,
  ProviderSelect,
  ReplyBox,
  useAiEndpoint,
} from "../components/aiShared";
import { api } from "../lib/api";
import { useEffect } from "react";

export default function AIAssistant() {
  const [provider, setProvider] = useState("openrouter");
  const [question, setQuestion] = useState("");
  const [petId, setPetId] = useState("");
  const [pets, setPets] = useState([]);

  const { run, loading, error, reply } = useAiEndpoint(
    "/api/ai/assistant/health"
  );

  useEffect(() => {
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => { });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    run({
      question,
      provider,
      ...(petId ? { petId } : {}),
    });
  };

  return (
    <AiPageShell
      title="AI Pet Health Assistant"
      description="Ask general health questions about your pet."
    >
      <form
        onSubmit={submit}
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
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder="e.g. My dog is not eating properly since yesterday. What should I do?"
          className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Asking…" : "Ask AI Vet"}
        </button>
      </form>

      <ReplyBox loading={loading} error={error} reply={reply} />
    </AiPageShell>
  );
}
