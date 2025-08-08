// RoomCard.jsx
import React from "react";

/**
 * RoomCard Component
 * Displays the details for a single room listing, including location,
 * price, languages spoken, distance from campus, and current weather.
 *
 * Props:
 *   - room: {
 *       title: string,
 *       location: string,
 *       price: number,
 *       languages: array of string,
 *       distanceToCampus: string,
 *       weather: "sunny" | "cloudy" | "rainy" | ...,
 *       weatherLabel: string,
 *     }
 */
export default function RoomCard({ room }) {
  // Simple weather icon mapping, could be expanded
  const weatherIcons = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    // Add more types as needed
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 flex flex-col sm:flex-row gap-4 items-center">
      {/* Room main info */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
          {room.title}
        </h3>
        <div className="text-gray-700 dark:text-gray-200 mb-1">
          <strong>Location:</strong> {room.location}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-1">
          <strong>Price:</strong> ${room.price}/month
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-1">
          <strong>Languages:</strong> {room.languages.join(", ")}
        </div>
      </div>
      {/* Distance and Weather info */}
      <div className="flex flex-col items-center justify-center min-w-[110px]">
        <div className="mb-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Distance
          </span>
          <div className="text-blue-700 dark:text-blue-300 text-xl font-bold">
            {room.distanceToCampus}
          </div>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Weather
          </span>
          <div className="text-2xl">
            {/* Show weather icon if known, else show a question mark */}
            {weatherIcons[room.weather] || "❓"}
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {room.weatherLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

