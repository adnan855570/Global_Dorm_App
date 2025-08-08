import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Rooms from "./Rooms";
import Applications from "./Applications";

export default function Home() {
  const { user } = useAuth();
  const [tab, setTab] = useState(""); // "" | "rooms" | "applications"
  const username = user?.username || user?.email || "Guest";

  return (
    <section className="flex flex-col items-center justify-start min-h-[80vh] px-4 pt-8">
      {/* Welcome Block, Room/App Tabs */}
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border dark:border-gray-800 max-w-2xl w-full p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center justify-center gap-2">
          <span>🏠</span> Welcome to Global Dorm!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-1">
          Hi, <b>{username}</b>! 🎉
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse room listings, apply for rooms, and manage your applications with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className={`px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition ${
              tab === "rooms" ? "ring-2 ring-blue-300" : ""
            }`}
            onClick={() => setTab(tab === "rooms" ? "" : "rooms")}
          >
            Browse Rooms
          </button>
          <button
            className={`px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 transition ${
              tab === "applications" ? "ring-2 ring-blue-300" : ""
            }`}
            onClick={() => setTab(tab === "applications" ? "" : "applications")}
          >
            View Applications
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-8">
        {tab === "rooms" && <Rooms embedded />}
        {tab === "applications" && <Applications embedded />}
      </div>
    </section>
  );
}
