import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Applications from "./pages/Applications";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Add this

export default function App() {
  const location = useLocation();
  // Only show Navbar on protected routes (not on login/register)
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen w-full bg-white dark:bg-gray-900 transition-colors">
        {!hideNavbar && <Navbar />}
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
