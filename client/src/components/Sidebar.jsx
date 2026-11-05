
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  CalendarDays,
  Pill,
  FileHeart,
  Bot,
  Settings,
  Heart,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Pets", path: "/pets", icon: PawPrint },
  { name: "Appointments", path: "/appointments", icon: CalendarDays },
  { name: "Prescriptions", path: "/prescriptions", icon: Pill },
  { name: "Medical History", path: "/medical-history", icon: FileHeart },
  { name: "AI Assistant", path: "/ai-assistant", icon: Bot },
  { name: "AI Settings", path: "/ai-settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col
        border-r border-slate-200 bg-gradient-to-b from-green-50 via-white to-white
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <PawPrint size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Vet</h1>
              <p className="text-xs text-slate-500">Pet Care Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X size={21} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-blue-700">
              <Heart size={20} />
              <span className="font-semibold">Pet Care Matters</span>
            </div>
            <p className="text-xs leading-5 text-slate-600">
              Keep your pets healthy, happy and protected.
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-slate-400">
            AI Vet © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
