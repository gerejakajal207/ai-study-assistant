import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin((v) => !v);
    setForm({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--accent)", animation: "pulse 6s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--accent)", animation: "pulse 8s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="w-full max-w-md relative">
        <div
          className="rounded-3xl border p-8 md:p-10"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="font-display text-xl font-bold" style={{ color: "var(--accent)" }}>
              StudyAI
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
            >
              beta
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8 animate-fade-up">
            <h1
              className="font-display text-3xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {isLogin ? "Welcome back." : "Create account."}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {isLogin
                ? "Log in to continue your learning journey."
                : "Start studying smarter today."}
            </p>
          </div>

          {/* Toggle */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-7"
            style={{ backgroundColor: "var(--bg-subtle)" }}
          >
            {["Login", "Sign Up"].map((label) => (
              <button
                key={label}
                onClick={() => setIsLogin(label === "Login")}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  (isLogin && label === "Login") || (!isLogin && label === "Sign Up")
                    ? { backgroundColor: "var(--accent)", color: "#fff" }
                    : { backgroundColor: "transparent", color: "var(--text-secondary)" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Name — signup only */}
            <div
              style={{
                maxHeight: isLogin ? "0px" : "80px",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Kajal Sharma"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Password
                </label>
                {isLogin && (
                  <button className="text-xs" style={{ color: "var(--accent)" }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-medium" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "#fff" }}
                  />
                  {isLogin ? "Logging in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Log In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </div>

          {/* Footer toggle */}
          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggle}
              className="font-semibold"
              style={{ color: "var(--accent)" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}