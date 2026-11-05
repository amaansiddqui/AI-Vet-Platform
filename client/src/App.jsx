
import { lazy, Suspense, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pets = lazy(() => import("./pages/Pets"));
const Appointments = lazy(() => import("./pages/Appointments"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory"));
const Prescriptions = lazy(() => import("./pages/Prescriptions"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const AISettings = lazy(() => import("./pages/AISettings"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/Register"));

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-[#f7fcf8] text-sm text-slate-700"
    >
      Loading page...
    </div>
  );
}

function ComingSoon({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl bg-blue-50 p-5 text-sm text-blue-700">
        This section is planned for the next development phase.
      </div>
    </div>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />

                <Route path="/pets" element={<Pets />} />

                <Route path="/appointments" element={<Appointments />} />

                <Route path="/prescriptions" element={<Prescriptions />} />

                <Route path="/medical-history" element={<MedicalHistory />} />

                <Route path="/ai-assistant" element={<AIAssistant />} />

                <Route path="/ai-settings" element={<AISettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
