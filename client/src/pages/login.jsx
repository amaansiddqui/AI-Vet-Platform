
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck, HeartPulse, PawPrint } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <aside className="flex min-h-[38vh] flex-col justify-between bg-gradient-to-br from-green-900 via-green-800 to-green-600 p-7 text-white sm:p-10 lg:min-h-screen lg:p-14">
        <Link to="/login" className="flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-800">
          <span className="rounded-xl bg-white/15 p-2.5">
            <PawPrint size={25} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold">AI Vet</span>
        </Link>

        <div className="my-10 max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-green-100">
            Pet care, brought together
          </p>
          <h2 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            A clearer view of your pet's health.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-green-50 sm:text-base">
            Keep the everyday details close, from upcoming visits to medical
            records and practical care guidance.
          </p>

          <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <li className="flex items-center gap-3">
              <PawPrint size={18} aria-hidden="true" />
              Pet profiles in one place
            </li>
            <li className="flex items-center gap-3">
              <CalendarCheck size={18} aria-hidden="true" />
              Visits and appointments
            </li>
            <li className="flex items-center gap-3">
              <HeartPulse size={18} aria-hidden="true" />
              Health records and guidance
            </li>
          </ul>
        </div>

        <p className="hidden text-xs text-green-100 lg:block">
          Thoughtful tools for the care they count on.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-[#f7fcf8] px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">Hello, there!</h1>
          <p className="mt-2 text-slate-600">Sign in to manage your pet's health.</p>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-800">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-green-700"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-800">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-green-700"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-green-800 underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
      </div>
  );
}
