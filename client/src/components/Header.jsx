
import { useEffect, useState } from "react";
import { Menu, Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const name = user?.name || "Pet Owner";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!searchOpen || query.length < 2) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(false);

      try {
        const [petData, appointmentData, recordData] = await Promise.all([
          api.get("/api/ai/pets"),
          api.get("/api/ai/appointments"),
          api.get("/api/ai/records"),
        ]);

        if (cancelled) return;

        const includesQuery = (values) =>
          values.filter(Boolean).join(" ").toLowerCase().includes(query);
        const results = [
          ...petData.pets
            .filter((pet) => includesQuery([pet.name, pet.species, pet.breed]))
            .map((pet) => ({
              id: `pet-${pet._id}`,
              title: pet.name,
              detail: `Pet · ${pet.species}${pet.breed ? ` · ${pet.breed}` : ""}`,
              path: "/pets",
            })),
          ...appointmentData.appointments
            .filter((appointment) =>
              includesQuery([
                appointment.pet?.name,
                appointment.reason,
                appointment.status,
                appointment.scheduledAt,
              ])
            )
            .map((appointment) => ({
              id: `appointment-${appointment._id}`,
              title: appointment.pet?.name || "Pet appointment",
              detail: `Appointment · ${appointment.reason || appointment.status || "Scheduled"}`,
              path: "/appointments",
            })),
          ...recordData.records
            .filter((record) =>
              includesQuery([
                record.pet?.name,
                record.diagnosis,
                record.treatment,
                record.prescription,
                record.notes,
                record.vetName,
              ])
            )
            .map((record) => ({
              id: `record-${record._id}`,
              title: `${record.pet?.name || "Pet"}: ${record.diagnosis || "Medical record"}`,
              detail: `Medical record · ${new Date(record.visitDate).toLocaleDateString()}`,
              path: "/prescriptions",
            })),
        ];

        setSearchResults(results.slice(0, 8));
      } catch {
        if (!cancelled) {
          setSearchResults([]);
          setSearchError(true);
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchOpen, searchTerm]);

  const openSearchResult = (path) => {
    navigate(path);
    setSearchTerm("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Welcome back!
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Here's what's happening with your pets today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const nextOpen = !searchOpen;
            setSearchOpen(nextOpen);
            if (!nextOpen) {
              setSearchTerm("");
              setSearchResults([]);
              setSearchLoading(false);
              setSearchError(false);
            }
          }}
          className="rounded-xl p-2.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 md:hidden"
          aria-label="Search"
          aria-expanded={searchOpen}
          aria-controls="header-search"
        >
          <Search size={19} aria-hidden="true" />
        </button>

        <form
          id="header-search"
          role="search"
          aria-label="Search pets and records"
          onSubmit={(event) => {
            event.preventDefault();
            if (searchResults[0]) openSearchResult(searchResults[0].path);
          }}
          className={`${searchOpen ? "flex" : "hidden"} absolute left-4 right-4 top-full z-40 mt-2 flex-col items-stretch rounded-xl border border-slate-200 bg-white shadow-lg md:relative md:left-auto md:right-auto md:top-auto md:mt-0 md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-slate-100 md:shadow-none`}
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <Search size={17} className="shrink-0 text-slate-500" aria-hidden="true" />
            <label htmlFor="header-search-input" className="sr-only">
              Search pets, appointments, and medical records
            </label>
            <input
              id="header-search-input"
              type="search"
              value={searchTerm}
              onChange={(event) => {
                const nextTerm = event.target.value;
                setSearchTerm(nextTerm);
                setSearchResults([]);
                setSearchLoading(nextTerm.trim().length >= 2);
                setSearchError(false);
              }}
              placeholder="Search pets and records"
              autoComplete="off"
              className="w-full bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-700 md:w-40"
            />
          </div>

          {(searchTerm.trim().length >= 2 || searchLoading || searchError) && (
            <div className="max-h-80 overflow-y-auto border-t border-slate-200 md:absolute md:left-0 md:right-0 md:top-full md:mt-2 md:rounded-xl md:border md:bg-white md:shadow-lg">
              <p className="sr-only" role="status" aria-live="polite">
                {searchLoading
                  ? "Searching"
                  : searchError
                    ? "Search is unavailable"
                    : searchResults.length
                      ? `${searchResults.length} search results`
                      : "No matching results"}
              </p>
              {searchLoading ? (
                <p className="px-4 py-3 text-sm text-slate-600">Searching…</p>
              ) : searchError ? (
                <p className="px-4 py-3 text-sm text-red-700" role="alert">
                  Search is temporarily unavailable.
                </p>
              ) : searchResults.length ? (
                <ul aria-label="Search results" className="py-1">
                  {searchResults.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => openSearchResult(result.path)}
                        className="w-full px-4 py-2.5 text-left hover:bg-green-50 focus-visible:bg-green-50 focus-visible:outline-none"
                      >
                        <span className="block text-sm font-medium text-slate-900">
                          {result.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-600">
                          {result.detail}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-600">
                  No matching pets, appointments, or records.
                </p>
              )}
            </div>
          )}
        </form>

        <button
          type="button"
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          aria-controls="notification-status"
        >
          <Bell size={19} aria-hidden="true" />
        </button>

        {notificationsOpen && (
          <div
            id="notification-status"
            role="status"
            aria-live="polite"
            className="absolute right-4 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg sm:right-8"
          >
            No notifications to display.
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            aria-label={`Account menu for ${name}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {initial}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-slate-500">
                {user?.email || "Member"}
              </p>
            </div>
            <ChevronDown size={16} className="hidden sm:block" aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
);

}
