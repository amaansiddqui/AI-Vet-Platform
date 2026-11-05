
import { useState } from "react";
import { api } from "../lib/api";
import { useEffect } from "react";
import { Pill, Plus, Trash2 } from "lucide-react";

export default function Prescriptions() {
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    pet: "",
    visitDate: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
    vetName: "",
  });
  const [message, setMessage] = useState(null);

  const loadRecords = () =>
    api.get("/api/ai/records").then((d) => setRecords(d.records)).catch(() => {});

  useEffect(() => {
    api.get("/api/ai/pets").then((d) => setPets(d.pets)).catch(() => {});
    loadRecords();
  }, []);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.pet) {
      setMessage({ ok: false, text: "Select a pet first" });
      return;
    }
    try {
      await api.post("/api/ai/records", {
        ...form,
        visitDate: form.visitDate || undefined,
      });
      setMessage({ ok: true, text: "Record added ✓" });
      setForm({
        pet: "",
        visitDate: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
        vetName: "",
      });
      loadRecords();
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    }
  };

  const remove = async (id) => {
    try {
      await api.post("/api/ai/records/delete", { id });
      loadRecords();
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Prescriptions & Medical History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your pets' prescriptions and vet visit records. These feed
          the AI medical history summary.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2 flex items-center gap-2 font-semibold text-slate-900">
          <Plus size={18} className="text-blue-600" />
          Add a record
        </div>

        <select
          name="pet"
          value={form.pet}
          onChange={change}
          className={inputClass}
          required
        >
          <option value="">Select pet</option>
          {pets.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.species})
            </option>
          ))}
        </select>

        <input
          name="visitDate"
          value={form.visitDate}
          onChange={change}
          type="date"
          className={inputClass}
        />

        <input
          name="diagnosis"
          value={form.diagnosis}
          onChange={change}
          placeholder="Diagnosis (e.g. Ear infection)"
          className={inputClass}
        />

        <input
          name="vetName"
          value={form.vetName}
          onChange={change}
          placeholder="Veterinarian name"
          className={inputClass}
        />

        <input
          name="treatment"
          value={form.treatment}
          onChange={change}
          placeholder="Treatment given"
          className={inputClass}
        />

        <input
          name="prescription"
          value={form.prescription}
          onChange={change}
          placeholder="Prescription (e.g. Amoxicillin 50mg, 2x daily)"
          className={inputClass}
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={change}
          rows={2}
          placeholder="Notes (optional)"
          className={`${inputClass} sm:col-span-2`}
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:col-span-2"
        >
          Save record
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

      {records.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          <Pill size={28} className="mx-auto mb-3 text-slate-300" />
          No records yet. Add your pet's prescriptions and vet visits above.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r._id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {r.pet?.name || "Pet"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(r.visitDate).toLocaleDateString()}
                    {r.vetName ? ` · Dr. ${r.vetName}` : ""}
                  </span>
                </div>

                <h3 className="mt-2 font-semibold text-slate-900">
                  {r.diagnosis || "Vet visit"}
                </h3>

                {r.treatment && (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-medium">Treatment:</span>{" "}
                    {r.treatment}
                  </p>
                )}

                {r.prescription && (
                  <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
                    <Pill size={15} className="mt-0.5 shrink-0 text-orange-500" />
                    <span>
                      <span className="font-medium">Prescription:</span>{" "}
                      {r.prescription}
                    </span>
                  </p>
                )}

                {r.notes && (
                  <p className="mt-1 text-sm text-slate-500">{r.notes}</p>
                )}
              </div>

              <button
                onClick={() => remove(r._id)}
                aria-label="Delete record"
                className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
