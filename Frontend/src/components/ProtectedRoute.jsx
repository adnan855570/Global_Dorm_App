// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute
 * Wrap this around any page/component you want to protect from unauthenticated access.
 * If the user is not logged in, they'll be redirected to the login page.
 * Otherwise, the child components will render normally.
 * 
 * Usage:
 * <ProtectedRoute>
 *    <YourPrivateComponent />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, show the protected content
  return children;
}
