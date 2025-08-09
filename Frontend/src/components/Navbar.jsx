import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  function handleLogout() {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-700 dark:text-blue-200"
          >
            <span className="text-2xl">🌍</span>
            <span>Global Dorm</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <button
              aria-label="Toggle Dark Mode"
              className="p-2 rounded text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setDark((v) => !v)}
              title="Toggle dark mode"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            {/* Only show full menu if not on auth pages */}
            {!isAuthPage && (
              <div className="hidden md:flex items-center gap-5">
                {user ? (
                  <>
                    <span className="text-gray-600 dark:text-gray-200">
                      Hi, <b>{user.username || user.email}</b>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-semibold shadow-sm transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-blue-600 dark:text-blue-300 hover:underline"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-blue-600 dark:text-blue-300 hover:underline"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
