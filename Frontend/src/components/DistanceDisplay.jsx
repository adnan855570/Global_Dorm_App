
import React from "react";

/**
 * Simple presentational component to show the distance from a room to campus (or another location).
 * Props:
 *  - distance: String, the distance to display (e.g., "2.1 km" or "Loading...")
 *  - onRefresh: Function, called when the user clicks the "Refresh" button
 */
export default function DistanceDisplay({ distance, onRefresh }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {/* Distance indicator with a little location pin SVG */}
      <span className="text-gray-400 text-xs flex items-center gap-1">
        {/* Pin Icon */}
        <svg width="16" height="16" fill="none" className="inline mr-1">
          <path
            d="M8 0a6.5 6.5 0 0 1 6.5 6.5c0 4.094-5.07 8.76-5.292 8.95a.75.75 0 0 1-.416.15.75.75 0 0 1-.416-.15C6.57 15.26 1.5 10.594 1.5 6.5A6.5 6.5 0 0 1 8 0Zm0 9.125A2.625 2.625 0 1 0 8 3.875a2.625 2.625 0 0 0 0 5.25Z"
            fill="#60a5fa"
          />
        </svg>
        {/* Display distance value (passed in as prop) */}
        {distance} away
      </span>
      {/* Refresh Button: lets user manually reload the distance info */}
      <button
        className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        onClick={onRefresh}
        type="button"
      >
        Refresh
      </button>
    </div>
  );
}
