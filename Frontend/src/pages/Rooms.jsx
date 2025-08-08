import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Rooms() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ location: "", maxPrice: "", language: "", postcode: "" });
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [appStatus, setAppStatus] = useState({});
  const [appIds, setAppIds] = useState({}); // Maps room_id to application_id
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  // New: Weather/Distance per-room
  const [distanceMap, setDistanceMap] = useState({});
  const [weatherMap, setWeatherMap] = useState({});

  // Fetch rooms from backend
  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/rooms/`);
        if (!res.ok) throw new Error("Failed to fetch rooms.");
        const data = await res.json();
        setRooms(data);
        setFilteredRooms(data);
      } catch (err) {
        setError(err.message || "Could not load rooms");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  // Fetch user's applications to know applied status
  useEffect(() => {
    async function fetchStatus() {
      if (!user) {
        setAppStatus({});
        setAppIds({});
        return;
      }
      try {
        const res = await fetch(`${API}/applications/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        // statusMap: { room_id: status }
        // appIds: { room_id: application_id }
        const statusMap = {};
        const idsMap = {};
        data.forEach(app => {
          const roomId = app.room_id;
          const stat = (app.status === "applied") ? "pending" : app.status;
          statusMap[roomId] = stat;
          idsMap[roomId] = app.id || app._id;
        });
        setAppStatus(statusMap);
        setAppIds(idsMap);
      } catch {}
    }
    fetchStatus();
  }, [user]);

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();
    let filtered = rooms.filter(room => {
      const matchesLocation = !filters.location || (room.location?.toLowerCase().includes(filters.location.toLowerCase()) || room.title?.toLowerCase().includes(filters.location.toLowerCase()));
      const matchesPrice = !filters.maxPrice || (room.price_per_month ?? room.price) <= Number(filters.maxPrice);
      const matchesLanguage = !filters.language || (room.languages || []).map(l => l.toLowerCase()).includes(filters.language.toLowerCase());
      const matchesPostcode = !filters.postcode || (room.postcode && room.postcode.includes(filters.postcode));
      return matchesLocation && matchesPrice && matchesLanguage && matchesPostcode;
    });
    setFilteredRooms(filtered);
  }

  function handleReset() {
    setFilters({ location: "", maxPrice: "", language: "", postcode: "" });
    setFilteredRooms(rooms);
  }

  // --- Application Logic ---
  async function handleApply(room_id) {
    setLoadingId(room_id);
    try {
      const res = await fetch(`${API}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ room_id }),
      });
      if (!res.ok) throw new Error("Failed to apply.");
      toast.success("Application submitted! Status: Pending");
      setAppStatus(prev => ({ ...prev, [room_id]: "pending" }));
    } catch (err) {
      toast.error(err.message || "Could not apply.");
    }
    setLoadingId(null);
  }

  async function handleCancel(room_id) {
    setLoadingId(room_id);
    try {
      // Need the application_id for this room
      const application_id = appIds[room_id];
      if (!application_id) throw new Error("No application found to cancel.");

      // PATCH /applications/{application_id}/cancel
      const res = await fetch(`${API}/applications/${application_id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to cancel.");
      toast("Application cancelled.", { icon: "🚫" });
      setAppStatus(prev => ({ ...prev, [room_id]: "cancelled" }));
    } catch (err) {
      toast.error(err.message || "Could not cancel.");
    }
    setLoadingId(null);
  }

  function getStatusBadge(status) {
    if (status === "pending" || status === "applied") return <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">Pending</span>;
    if (status === "accepted") return <span className="bg-green-700 text-white px-3 py-1 rounded-full text-xs">Accepted</span>;
    if (status === "rejected") return <span className="bg-red-700 text-white px-3 py-1 rounded-full text-xs">Rejected</span>;
    if (status === "cancelled") return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">Cancelled</span>;
    return null;
  }

  // --- DISTANCE & WEATHER ---

  async function handleRefreshDistance(room_id) {
    setDistanceMap(prev => ({ ...prev, [room_id]: { loading: true } }));
    try {
      const res = await fetch(`${API}/external/room-distance?room_id=${room_id}`);
      if (!res.ok) throw new Error("Could not fetch distance.");
      const data = await res.json();
      setDistanceMap(prev => ({
        ...prev,
        [room_id]: { value: (data.distance_meters / 1000).toFixed(1) + " km", loading: false }
      }));
      toast.success("Distance updated!");
    } catch (err) {
      setDistanceMap(prev => ({ ...prev, [room_id]: { value: "Error", loading: false } }));
      toast.error("Failed to get distance.");
    }
  }

  async function handleGetWeather(room) {
    const room_id = room.id || room._id;
    setWeatherMap(prev => ({ ...prev, [room_id]: { loading: true } }));
    try {
      const res = await fetch(`${API}/external/geocode?postcode=${room.postcode}`);
      if (!res.ok) throw new Error("Geocode failed");
      const geo = await res.json();

      setWeatherMap(prev => ({
        ...prev,
        [room_id]: {
          value: geo.latitude && geo.longitude
            ? `Lat: ${geo.latitude.toFixed(4)}, Lng: ${geo.longitude.toFixed(4)}`
            : "Unavailable",
          loading: false,
        }
      }));
      toast.success("Weather data fetched! (demo)");
    } catch (err) {
      setWeatherMap(prev => ({ ...prev, [room_id]: { value: "Error", loading: false } }));
      toast.error("Failed to get weather.");
    }
  }

  // --- Render ---
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Toaster />
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-200">
        Room Listings
      </h2>
      {/* FILTER/SEARCH */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 justify-center mb-8">
        <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" className="w-full md:w-auto px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-400 transition" />
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="w-full md:w-auto px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-400 transition" />
        <input type="text" name="language" value={filters.language} onChange={handleFilterChange} placeholder="Language" className="w-full md:w-auto px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-400 transition" />
        <input type="text" name="postcode" value={filters.postcode} onChange={handleFilterChange} placeholder="Postcode" className="w-full md:w-auto px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-400 transition" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition">Search</button>
        <button type="button" onClick={handleReset} className="ml-0 md:ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 transition">Reset</button>
      </form>
      {/* LOADING/ERROR */}
      {loading && <div className="text-center text-blue-500 py-6">Loading rooms...</div>}
      {error && <div className="text-center text-red-500 py-6">{error}</div>}
      {/* ROOMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {!loading && filteredRooms.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No rooms found for your criteria.
          </div>
        )}
        {filteredRooms.map(room => {
          const room_id = room.id || room._id;
          const status = appStatus[room_id];
          const distanceInfo = distanceMap[room_id];
          const weatherInfo = weatherMap[room_id];
          return (
            <div key={room_id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col">
              <img src={room.image || "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"} alt={room.location || room.title} className="rounded-xl w-full h-40 object-cover mb-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg text-blue-700 dark:text-blue-300">
                    {room.location || room.title}
                  </span>
                  <span className="ml-auto px-3 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 font-semibold">
                    ${room.price_per_month ?? room.price}/mo
                  </span>
                </div>
                {/* Weather */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Weather: {weatherInfo?.loading ? "Loading..." : weatherInfo?.value || "—"}
                  </span>
                  <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    onClick={() => handleGetWeather(room)} type="button">
                    Get Weather
                  </button>
                </div>
                {/* Distance */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <svg width="16" height="16" fill="none" className="inline mr-1">
                      <path d="M8 0a6.5 6.5 0 0 1 6.5 6.5c0 4.094-5.07 8.76-5.292 8.95a.75.75 0 0 1-.416.15.75.75 0 0 1-.416-.15C6.57 15.26 1.5 10.594 1.5 6.5A6.5 6.5 0 0 1 8 0Zm0 9.125A2.625 2.625 0 1 0 8 3.875a2.625 2.625 0 0 0 0 5.25Z" fill="#60a5fa" />
                    </svg>
                    Distance: {distanceInfo?.loading ? "Loading..." : distanceInfo?.value || "—"}
                  </span>
                  <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    onClick={() => handleRefreshDistance(room_id)} type="button">
                    Refresh
                  </button>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300 text-xs">
                    Languages:{" "}
                  </span>
                  {(room.languages || []).map(lang => (
                    <span key={lang} className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded px-2 py-0.5 mr-1 text-xs">{lang}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  Postcode: {room.postcode || "-"}
                </div>
                <div className="my-2">{status && getStatusBadge(status)}</div>
              </div>
              {/* Application buttons */}
              {user ? (
                <>
                  {!status || status === "cancelled" ? (
                    <button
                      className="mt-4 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      onClick={() => handleApply(room_id)}
                      disabled={loadingId === room_id}
                    >
                      {loadingId === room_id && <Spinner />}
                      Apply
                    </button>
                  ) : (
                    <button
                      className="mt-4 bg-red-600 text-white font-semibold rounded-lg px-4 py-2 shadow hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      onClick={() => handleCancel(room_id)}
                      disabled={loadingId === room_id}
                    >
                      {loadingId === room_id && <Spinner />}
                      Cancel Application
                    </button>
                  )}
                </>
              ) : (
                <div className="mt-4 text-gray-400 text-sm text-center">Login to apply</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Spinner component
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-1 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
