
import { useState } from "react";
import { api } from "../lib/api";
import { useEffect } from "react";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    species: "dog",
    breed: "",
    age: "",
    weightKg: "",
  });
  const [message, setMessage] = useState(null);

  const loadPets = () =>
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => {});

  useEffect(() => {
    loadPets();
  }, []);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/ai/pets", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      });
      setMessage({ ok: true, text: `${form.name} added ✓` });
      setForm({ name: "", species: "dog", breed: "", age: "", weightKg: "" });
      loadPets();
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Pets</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pet profiles power the AI nutrition and health assistants.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <input
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Pet name"
          required
          className={inputClass}
        />

        <select
          name="species"
          value={form.species}
          onChange={change}
          className={inputClass}
        >
          {["dog", "cat", "bird", "rabbit", "other"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          name="breed"
          value={form.breed}
          onChange={change}
          placeholder="Breed (optional)"
          className={inputClass}
        />

        <input
          name="age"
          value={form.age}
          onChange={change}
          type="number"
          min="0"
          step="0.1"
          placeholder="Age (years)"
          className={inputClass}
        />

        <input
          name="weightKg"
          value={form.weightKg}
          onChange={change}
          type="number"
          min="0"
          step="0.1"
          placeholder="Weight (kg)"
          className={inputClass}
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add pet
        </button>

        {message && (
          <p
            className={`text-sm sm:col-span-2 ${
              message.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>

      {pets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-3 font-semibold text-slate-900">{p.name}</h3>
              <p className="text-sm text-slate-500">
                {p.species}
                {p.breed ? ` · ${p.breed}` : ""}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {[p.age != null ? `${p.age} yrs` : null, p.weightKg != null ? `${p.weightKg} kg` : null]
                  .filter(Boolean)
                  .join(" · ") || "Details not set"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
