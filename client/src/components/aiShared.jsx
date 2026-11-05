
import { useState } from "react";
import { api } from "../lib/api";

const PROVIDERS = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "nvidia", label: "NVIDIA" },
];

// Small reusable page shell for the AI tools
export function AiPageShell({ title, description, children }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        AI responses are general information only — not a diagnosis. Always
        consult a licensed veterinarian for your pet's health.
      </div>

      {children}
    </div>
  );
}

// Provider selector + reply display shared by all AI tools
export function ProviderSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">AI Provider</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
      >
        {PROVIDERS.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ReplyBox({ loading, error, reply }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Thinking…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!reply) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {reply}
      </p>
    </div>
  );
}

export function useAiEndpoint(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState(null);

  const run = async (body) => {
    setLoading(true);
    setError(null);
    setReply(null);
    try {
      const data = await api.post(endpoint, body);
      setReply(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error, reply };
}
