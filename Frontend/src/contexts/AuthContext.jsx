import React, { createContext, useContext, useState, useEffect } from "react";

// Set API endpoint from environment or fallback to localhost
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Context for auth state
const AuthContext = createContext();

/**
 * AuthProvider
 * 
 * Provides authentication state and functions (login, logout, register)
 * to the rest of the app via React context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, check for JWT and user info in localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username }); // simple user object with username/email
    }
  }, []);

  /**
   * Register a new user
   * - Does not auto-login; call login after registration.
   */
  async function register({ email, password }) {
    const res = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      // Try to parse error message, fallback to default
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Registration failed");
    }
    // Success, but don't set user state (require explicit login)
    return await res.json();
  }

  /**
   * Login user (save JWT and email to localStorage)
   */
  async function login({ email, password }) {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("jwt", data.access_token);
    localStorage.setItem("username", email);
    setUser({ username: email });
  }

  /**
   * Logout user (clears JWT and username)
   */
  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setUser(null);
  }

  // Context value exposed to consumers
  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Use in your components to access the auth context (user, login, logout, register)
 */
export function useAuth() {
  return useContext(AuthContext);
}
