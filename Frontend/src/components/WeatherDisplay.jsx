
import React from "react";

/**
 * WeatherDisplay
 * 
 * Shows the current weather summary for a room, with a button to fetch (or refresh) the latest weather.
 *
 * Props:
 *   weather: string – a short weather summary, e.g. "☀️ Sunny, 22°C"
 *   onGetWeather: function – called when user clicks the "Get Weather" button
 */
export default function WeatherDisplay({ weather, onGetWeather }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {/* Shows weather summary if provided, or a placeholder */}
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        {weather || "Weather unavailable"}
      </span>
      <button
        className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        onClick={onGetWeather}
        type="button"
      >
        Get Weather
      </button>
    </div>
  );
}
