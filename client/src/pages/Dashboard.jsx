
import { useEffect, useState } from "react";
import {
  PawPrint,
  CalendarCheck,
  Pill,
  HeartPulse,
  Plus,
  ArrowRight,
  Bot
} from "lucide-react";

import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import PetCard from "../components/PetCard";
import AppointmentList from "../components/AppointmentList";
import { api } from "../lib/api";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setCurrentTime(Date.now());
      try {
        const [petData, appointmentData, recordData] = await Promise.all([
          api.get("/api/ai/pets"),
          api.get("/api/ai/appointments"),
          api.get("/api/ai/records"),
        ]);

        if (!isMounted) return;
        setPets(petData.pets);
        setAppointments(appointmentData.appointments);
        setRecords(recordData.records);
        setLoadError(false);
      } catch {
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    window.addEventListener("focus", loadDashboard);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", loadDashboard);
    };
  }, []);

  const upcomingAppointments = appointments.filter((appointment) => {
    const scheduledTime = Date.parse(appointment.scheduledAt);
    return (
      currentTime !== null &&
      scheduledTime >= currentTime &&
      !["completed", "cancelled"].includes(appointment.status)
    );
  });
  const prescriptionCount = records.filter((record) =>
    record.prescription?.trim()
  ).length;

  return (
    <div className="space-y-8">

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your pets and their healthcare in one place.
          </p>
        </div>

        <Link
          to="/pets"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <Plus size={18} aria-hidden="true" />
          Add New Pet
        </Link>
      </section>

      {loadError && (
        <p role="alert" className="text-sm text-red-700">
          Dashboard data could not be loaded. Please try again later.
        </p>
      )}

      <section className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <Bot size={22} aria-hidden="true" />
              <span className="text-sm font-semibold">
                AI Pet Health Assistant
              </span>
            </div>

            <h2 className="text-2xl font-bold">
              Your pet care companion is here!
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Get general pet health information and nutrition guidance
              with our AI assistant.
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
          >
            Ask AI Assistant <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        aria-label="Account summary"
        aria-busy={loading}
        aria-live="polite"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Total Pets"
          value={loading ? "Loading" : loadError ? "Unavailable" : pets.length}
          subtitle="Registered pets"
          icon={PawPrint}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Appointments"
          value={loading ? "Loading" : loadError ? "Unavailable" : upcomingAppointments.length}
          subtitle="Upcoming visits"
          icon={CalendarCheck}
          color="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Prescriptions"
          value={loading ? "Loading" : loadError ? "Unavailable" : prescriptionCount}
          subtitle="Records with prescriptions"
          icon={Pill}
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Health Records"
          value={loading ? "Loading" : loadError ? "Unavailable" : records.length}
          subtitle="Medical records"
          icon={HeartPulse}
          color="bg-green-50 text-green-600"
        />
      </section>

      <section aria-labelledby="my-pets-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="my-pets-heading" className="text-xl font-bold text-slate-900">
              My Pets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your lovely companions
            </p>
          </div>

          <Link
            to="/pets"
            className="flex items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            View All <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              nextVisit={upcomingAppointments.find(
                (appointment) => String(appointment.pet?._id) === String(pet._id)
              )?.scheduledAt}
            />
          ))}
          {!loading && !loadError && pets.length === 0 && (
            <p className="text-sm text-slate-600">No pets have been added yet.</p>
          )}
        </div>
      </section>

      <section>
        <AppointmentList
          appointments={upcomingAppointments}
          loading={loading}
          error={loadError}
        />
      </section>

    </div>
  );
}
