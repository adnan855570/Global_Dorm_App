// Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useDarkMode from "../hooks/useDarkMode";

/**
 * Navbar
 * Main navigation bar for the app, supports:
 *  - User login/logout UI
 *  - Mobile hamburger menu
 *  - Dark/light mode toggle
 *  - Shows only relevant links depending on auth status
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  // Handle user logout and redirect to login page
  function handleLogout() {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/title always links to home */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 dark:text-blue-200">
            <span className="text-2xl">🌍</span>
            <span>Global Dorm</span>
          </Link>

          {/* Desktop navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                <Link to="/" className="text-blue-700 dark:text-blue-200 hover:underline">Home</Link>
                <Link to="/rooms" className="text-blue-700 dark:text-blue-200 hover:underline">Rooms</Link>
                <Link to="/applications" className="text-blue-700 dark:text-blue-200 hover:underline">Applications</Link>
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
                <Link to="/login" className="text-blue-600 dark:text-blue-300 hover:underline">Login</Link>
                <Link to="/register" className="text-blue-600 dark:text-blue-300 hover:underline">Register</Link>
              </>
            )}
            {/* Dark/light toggle */}
            <button
              aria-label="Toggle Dark Mode"
              className="ml-3 p-2 rounded text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setDark((v) => !v)}
              title="Toggle dark mode"
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Open Menu"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu (shown when menuOpen is true) */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-4 pb-3 pt-2 shadow-lg animate-fadein transition-colors">
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/" className="text-blue-700 dark:text-blue-200 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/rooms" className="text-blue-700 dark:text-blue-200 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Rooms</Link>
                <Link to="/applications" className="text-blue-700 dark:text-blue-200 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Applications</Link>
                <span className="text-gray-600 dark:text-gray-200 py-2">Hi, <b>{user.username || user.email}</b></span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 dark:text-blue-300 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-blue-600 dark:text-blue-300 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
            {/* Mobile dark/light toggle */}
            <button
              aria-label="Toggle Dark Mode"
              className="mt-2 p-2 rounded text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              onClick={() => setDark((v) => !v)}
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

