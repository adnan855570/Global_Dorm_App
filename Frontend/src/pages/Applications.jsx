import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Applications({ embedded }) {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState({ location: "", status: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [error, setError] = useState("");

  // Fetch applications from backend
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    fetch(`${API}/applications/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Could not fetch"))
      .then(setApps)
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, [user, cancelId]);

  // Filter logic (client side, on already fetched data)
  const filteredApplications = apps.filter(app => {
    const room = app.room || {};
    // 1. Location filter
    const roomLocation = room.location || room.title || app.room_location || "";
    if (
      filter.location &&
      !roomLocation.toLowerCase().includes(filter.location.toLowerCase())
    ) return false;

    // 2. Status filter (handle 'applied' as 'pending' for user)
    const appStatus = (app.status || "").toLowerCase();
    const filterStatus = (filter.status || "").toLowerCase();
    if (
      filter.status &&
      !(
        (filterStatus === "pending" && (appStatus === "pending" || appStatus === "applied")) ||
        appStatus === filterStatus
      )
    ) return false;

    // 3. Date filter (created_at)
    const appDate = app.created_at ? app.created_at.slice(0, 10) : "";
    if (
      filter.date &&
      appDate !== filter.date
    ) return false;

    return true;
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  }

  function handleSearch(e) {
    e.preventDefault();
    // Filtering is automatic via state
  }

  function handleClear() {
    setFilter({ location: "", status: "", date: "" });
  }

  // Cancel a pending application (now PATCH /applications/{id}/cancel)
  async function handleCancel(app) {
    setCancelId(app.id || app._id);
    try {
      const res = await fetch(`${API}/applications/${app.id || app._id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!res.ok) throw new Error("Could not cancel application");
      toast("Application cancelled.", { icon: "🚫" });
      // Re-fetch applications to reflect new status
      setCancelId(null); // Will trigger useEffect to reload
    } catch (err) {
      toast.error(err.message || "Cancel failed");
      setCancelId(null);
    }
  }

  function statusBadge(status) {
    if (status === "pending" || status === "applied") return <span className="bg-yellow-700 text-white px-4 py-1 rounded-full font-semibold text-sm">Pending</span>;
    if (status === "accepted") return <span className="bg-green-800 text-white px-4 py-1 rounded-full font-semibold text-sm">Accepted</span>;
    if (status === "rejected") return <span className="bg-red-700 text-white px-4 py-1 rounded-full font-semibold text-sm">Rejected</span>;
    if (status === "cancelled") return <span className="bg-gray-600 text-white px-4 py-1 rounded-full font-semibold text-sm">Cancelled</span>;
    return <span className="bg-gray-400 text-white px-4 py-1 rounded-full font-semibold text-sm">{status}</span>;
  }

  if (!user) return <div className="text-center text-gray-400 py-10">Login to view your applications.</div>;

  return (
    <section className={`${embedded ? "" : "max-w-3xl mx-auto px-4 py-12"}`}>
      <Toaster />
      {!embedded && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700 dark:text-blue-200 text-center">
          Your Applications
        </h2>
      )}

      {/* Filter Bar */}
      <form
        className="flex flex-col sm:flex-row items-center gap-3 mb-8 bg-white/70 dark:bg-gray-900/70 p-4 rounded-lg shadow"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name="location"
          value={filter.location}
          onChange={handleInputChange}
          placeholder="Location"
          className="px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-400 transition w-full sm:w-auto"
        />
        <select
          name="status"
          value={filter.status}
          onChange={handleInputChange}
          className="px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-400 transition w-full sm:w-auto"
        >
          <option value="">Status</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleInputChange}
          className="px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-400 transition w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Search
        </button>
        <button
          type="button"
          className="text-gray-500 hover:text-blue-700 px-2 py-2 rounded transition w-full sm:w-auto"
          onClick={handleClear}
        >
          Clear
        </button>
      </form>

      {/* Loading/Error */}
      {loading && <div className="text-center text-blue-500 py-6">Loading applications...</div>}
      {error && <div className="text-center text-red-500 py-6">{error}</div>}

      {/* Applications List */}
      <div className="flex flex-col gap-6">
        {!loading && filteredApplications.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No applications found for your criteria.
          </div>
        ) : (
          filteredApplications.map((app) => {
            const room = app.room || {};
            const status = app.status;
            // Show location/title if available
            const roomTitle = room.location || room.title || app.room_location || app.room_id || "Room";
            const appliedDate = app.created_at ? app.created_at.slice(0, 10) : "-";
            return (
              <div
                key={app.id || app._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-6 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-lg text-blue-800 dark:text-blue-200">{roomTitle}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    Applied on: {appliedDate}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {statusBadge(status)}
                  {(status === "pending" || status === "applied") && (
                    <button
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700 transition disabled:opacity-60"
                      onClick={() => handleCancel(app)}
                      disabled={cancelId === (app.id || app._id)}
                    >
                      {cancelId === (app.id || app._id) ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
