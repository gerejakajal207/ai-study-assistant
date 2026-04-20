import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { getToken, logout } from "../services/api";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Topic Practice", path: "/topic-practice" },
    { label: "Notes Upload", path: "/notes-upload" },
    { label: "Chat", path: "/chat" },
  ];

  if (location.pathname === "/auth") return null;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
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

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === link.path ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: location.pathname === link.path ? "var(--accent-light)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-subtle)",
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-subtle)",
              }}
            >
              Login
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)" }}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}